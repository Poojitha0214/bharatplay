import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { baseSkills, insightBank, reportBaseline, sessionHistory } from "./mockData";

const KEY = "bharatplay.state.v1";

const initialState = {
  skills: Object.fromEntries(baseSkills.map((s) => [s.key, s.value])),
  sessions: sessionHistory,
  craftSkill: reportBaseline.craft,
  accuracy: reportBaseline.accuracy,
  eegEverConnected: false,
  chakraUnlocked: 1,
  chakraSolved: 0,
  chakraBest: 0,
  driveDone: false,
  driveBest: 0,
  focusBest: 0,
  traditionsBest: 0,
  mahabharataBest: 0,
  craftsCompleted: { pottery: 0, carving: 0 },
  craftAccuracy: { pottery: 0, carving: 0 },
  playCount: 0,
  streak: 4,
  minutes: 26,
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return { ...initialState, ...parsed, sessions: sessionHistory };
  } catch {
    return initialState;
  }
}

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(load);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — the prototype still works in memory */
    }
  }, [state]);

  const toast = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t.slice(-3), { id, message, tone: opts.tone ?? "info", icon: opts.icon ?? null }]);
    setTimeout(() => {
      setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 350);
    }, opts.duration ?? 3600);
  }, []);

  const patch = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), []);

  /* ---------- Skill progression (all values stay within 0-100) ---------- */
  const addSkill = useCallback((key, delta) => {
    patch((s) => ({
      ...s,
      skills: { ...s.skills, [key]: clamp(s.skills[key] + delta) },
    }));
  }, [patch]);

  const addToSkill = useCallback((deltas) => {
    patch((s) => {
      const skills = { ...s.skills };
      Object.entries(deltas).forEach(([k, v]) => {
        skills[k] = clamp(skills[k] + v);
      });
      return { ...s, skills };
    });
  }, [patch]);

  const updateSession7 = useCallback((values) => {
    patch((s) => {
      const sessions = s.sessions.slice();
      const last = sessions[sessions.length - 1];
      sessions[sessions.length - 1] = { ...last, ...values };
      return { ...s, sessions };
    });
  }, [patch]);

  const finishFocusRun = useCallback(({ score, accuracy }) => {
    patch((s) => {
      const focusGain = Math.round(Math.min(6, 1 + score / 22));
      return {
        ...s,
        focusBest: Math.max(s.focusBest, score),
        accuracy: clamp(Math.round(s.accuracy * 0.65 + accuracy * 0.35)),
        skills: { ...s.skills, focus: clamp(s.skills.focus + focusGain) },
        minutes: s.minutes + 1,
        playCount: s.playCount + 1,
        sessions: s.sessions.map((x, i) =>
          i === s.sessions.length - 1 ? { ...x, focus: clamp(x.focus + focusGain) } : x,
        ),
      };
    });
  }, [patch]);

  const finishChakra = useCallback(({ solved, correct }) => {
    patch((s) => ({
      ...s,
      chakraBest: Math.max(s.chakraBest, solved),
      chakraSolved: s.chakraSolved + solved,
      chakraUnlocked: Math.max(s.chakraUnlocked, Math.min(5, solved + 1)),
      skills: {
        ...s.skills,
        strategy: clamp(s.skills.strategy + Math.round(correct / 4)),
        memory: clamp(s.skills.memory + Math.round(solved / 3)),
      },
      playCount: s.playCount + 1,
      minutes: s.minutes + 4,
    }));
  }, [patch]);

  const finishCraft = useCallback(({ kind, accuracy, timeSec }) => {
    patch((s) => {
      const gain = clamp(Math.round(accuracy / 18));
      const bestAcc = Math.max(s.craftAccuracy[kind] || 0, accuracy);
      return {
        ...s,
        craftSkill: clamp(s.craftSkill + gain),
        skills: { ...s.skills, creativity: clamp(s.skills.creativity + gain) },
        craftAccuracy: { ...s.craftAccuracy, [kind]: bestAcc },
        craftsCompleted: { ...s.craftsCompleted, [kind]: (s.craftsCompleted[kind] || 0) + 1 },
        minutes: s.minutes + Math.max(1, Math.round(timeSec / 30)),
        playCount: s.playCount + 1,
        sessions: s.sessions.map((x, i) =>
          i === s.sessions.length - 1 ? { ...x, creativity: clamp(x.creativity + gain) } : x,
        ),
      };
    });
  }, [patch]);

  const finishDrive = useCallback(({ percent, checkpoints }) => {
    patch((s) => ({
      ...s,
      driveDone: true,
      driveBest: Math.max(s.driveBest, percent),
      skills: {
        ...s.skills,
        focus: clamp(s.skills.focus + (percent >= 100 ? 4 : Math.round(percent / 40))),
        strategy: clamp(s.skills.strategy + (checkpoints > 2 ? 2 : 1)),
      },
      minutes: s.minutes + 2,
      playCount: s.playCount + 1,
    }));
  }, [patch]);

  const finishMini = useCallback(({ key, score }) => {
    patch((s) => ({
      ...s,
      [key]: Math.max(s[key] || 0, score),
      playCount: s.playCount + 1,
      minutes: s.minutes + 3,
      skills: {
        ...s.skills,
        memory: clamp(s.skills.memory + (key === "traditionsBest" ? 3 : 1)),
        strategy: clamp(s.skills.strategy + (key === "mahabharataBest" ? 4 : 0)),
      },
    }));
  }, [patch]);

  const reset = useCallback(() => {
    setState(initialState);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  /* ---------- Derived report ---------- */
  const skillRows = useMemo(
    () =>
      baseSkills.map((s) => ({
        ...s,
        value: state.skills[s.key] ?? s.value,
      })),
    [state.skills],
  );

  const report = useMemo(() => {
    const b = reportBaseline;
    const sk = state.skills;
    const blend = (baseline, live, liveWeight = 0.55) =>
      Math.round(baseline * (1 - liveWeight) + live * liveWeight);
    return [
      { key: "focus", label: "Focus", Icon: "brain", value: blend(b.focus, sk.focus, 0.5), note: "Attention held per round", accent: "var(--a-focus)" },
      { key: "accuracy", label: "Accuracy", Icon: "target", value: state.accuracy, note: "Correct answers across games", accent: "var(--teal)" },
      { key: "problemSolving", label: "Problem Solving", Icon: "puzzle", value: blend(b.problemSolving, clamp(sk.memory + sk.strategy) / 2, 0.6), note: "Layers cleared in Chakravyuha", accent: "var(--marigold)" },
      { key: "strategy", label: "Strategy", Icon: "strategy", value: blend(b.strategy, sk.strategy, 0.5), note: "Choices made under pressure", accent: "#ffd166" },
      { key: "creativity", label: "Creativity", Icon: "palette", value: blend(b.creativity, sk.creativity, 0.5), note: "Craft traces and free choices", accent: "var(--rose)" },
      { key: "craft", label: "Craft Skill", Icon: "craft", value: state.craftSkill, note: "Hand steadiness in Create mode", accent: "var(--a-create)" },
    ];
  }, [state]);

  const insight = useMemo(() => {
    const sorted = [...report].sort((a, b) => b.value - a.value);
    const weakest = sorted[sorted.length - 1];
    const template = insightBank[state.playCount % insightBank.length];
    return {
      strongest: sorted[0],
      weakest,
      headline: template.title,
      body: template.body,
      focus: template.focus,
    };
  }, [report, state.playCount]);

  const value = useMemo(
    () => ({
      ...state,
      setState,
      patch,
      toast,
      toasts,
      addSkill,
      addToSkill,
      updateSession7,
      finishFocusRun,
      finishChakra,
      finishCraft,
      finishDrive,
      finishMini,
      reset,
      report,
      insight,
      skillRows,
    }),
    [state, toasts, patch, toast, addSkill, addToSkill, updateSession7, finishFocusRun, finishChakra, finishCraft, finishDrive, finishMini, reset, report, insight, skillRows],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/* =============================================================
   TINY HOOKS
   ============================================================= */

export function useRaf(cb, active = true) {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  }, [cb]);
  useEffect(() => {
    if (!active) return undefined;
    let id;
    const tick = (t) => {
      ref.current(t);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active]);
}

/** Smoothly animate a number toward a target. */
export function useSmoothNumber(target, { duration = 900, active = true, decimals = 0 } = {}) {
  const [value, setValue] = useState(active ? 0 : target);
  const fromRef = useRef(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setValue(target);
      return undefined;
    }
    fromRef.current = value;
    startRef.current = null;
    let id;
    const step = (ts) => {
      if (startRef.current === null) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (target - fromRef.current) * eased;
      setValue(Number(next.toFixed(decimals)));
      if (t < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, active]);

  return value;
}
