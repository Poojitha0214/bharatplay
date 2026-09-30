import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  Loader,
  Radio,
  Signal,
  Waves,
  Zap,
  CircleCheck,
  Gauge,
  Cpu,
  Car,
  ArrowRight,
  Timer,
  Target,
  Flame,
  RotateCcw,
  CircleAlert,
  Sparkles,
} from "lucide-react";
import { focusSymbols } from "../lib/mockData";
import { useApp, useSmoothNumber } from "../lib/store";
import { useSimulatedEeg } from "../lib/useSimulated";
import BrainWave from "../components/BrainWave";
import { Bar, DemoBadge, DemoNote, PageHeader, Ring } from "../components/ui";

const ROUND_SECONDS = 30;
const SHOW_MS = 1150;
const CHOICES = 4;

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeChoices(target) {
  const others = shuffled(focusSymbols.filter((s) => s.key !== target.key)).slice(0, CHOICES - 1);
  return shuffled([target, ...others]);
}

/* =============================================================
   EEG PANEL — everything here is simulated
   ============================================================= */
function EegPanel() {
  const { patch, toast } = useApp();
  const [status, setStatus] = useState("off"); // off | connecting | on
  const reading = useSimulatedEeg(status === "on");
  const attention = useSmoothNumber(reading.attention, { duration: 600 });
  const live = status === "on";

  useEffect(() => {
    if (status !== "connecting") return undefined;
    const t = setTimeout(() => {
      setStatus("on");
      patch((s) => ({ ...s, eegEverConnected: true }));
      window.dispatchEvent(new Event("bp:eeg-on"));
      toast("EEG demo connected. The readings below are generated in your browser.", { tone: "ok" });
    }, 1900);
    return () => clearTimeout(t);
  }, [status, patch, toast]);

  const disconnect = () => {
    setStatus("off");
    window.dispatchEvent(new Event("bp:eeg-off"));
    toast("EEG demo disconnected.", { tone: "info" });
  };

  return (
    <section className="card card-pad motif-top">
      <div className="row-between wrap" style={{ gap: 12 }}>
        <div className="row" style={{ gap: 11 }}>
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              display: "grid",
              placeItems: "center",
              background: "rgba(147,166,255,0.13)",
              border: "1px solid rgba(147,166,255,0.28)",
              flex: "none",
            }}
          >
            <BrainCircuit size={20} style={{ color: "var(--a-focus)" }} />
          </span>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.98rem" }}>EEG headset</div>
            <div className="faint" style={{ fontSize: "0.76rem" }}>
              {live
                ? "Receiving attention signals…"
                : status === "connecting"
                  ? "Looking for a demo signal…"
                  : "Demo mode — headset not connected"}
            </div>
          </div>
        </div>

        <div className="row" style={{ gap: 8 }}>
          {live ? (
            <>
              <span className="pill pill-live">
                <span className="dot dot-live" /> EEG connected
              </span>
              <button className="btn btn-soft btn-sm" onClick={disconnect}>
                Disconnect
              </button>
            </>
          ) : (
            <button className="btn btn-teal btn-sm" onClick={() => setStatus("connecting")} disabled={status === "connecting"}>
              {status === "connecting" ? (
                <>
                  <Loader size={14} className="spin" /> Connecting…
                </>
              ) : (
                <>
                  <Radio size={14} /> Simulate EEG connection
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <BrainWave active={live} bands={[reading.theta, reading.alpha, reading.beta]} hue="cool" height={88} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginTop: 14 }}>
        <div className="stat">
          <div className="row-between">
            <span className="k">Attention estimate</span>
            <Target size={14} style={{ color: "var(--a-focus)" }} />
          </div>
          <div className="v mono">{live ? `${attention}%` : "—"}</div>
          <div style={{ marginTop: 8 }}>
            <Bar value={live ? attention : 0} from="var(--a-focus)" to="#6cc6ff" className="bar-thin" />
          </div>
        </div>

        <div className="stat">
          <div className="row-between">
            <span className="k">Mental workload</span>
            <Gauge size={14} style={{ color: "var(--marigold)" }} />
          </div>
          <div className="v" style={{ fontSize: "1.2rem" }}>
            {live ? reading.workload : "—"}
          </div>
          <div className="faint" style={{ fontSize: "0.72rem", marginTop: 4 }}>
            {live ? "From the demo signal shape" : "Connect to see"}
          </div>
        </div>

        <div className="stat">
          <div className="row-between">
            <span className="k">Signal quality</span>
            <Signal size={14} style={{ color: "var(--teal)" }} />
          </div>
          <div className="v mono">{live ? `${reading.signal}%` : "—"}</div>
          <div style={{ marginTop: 8 }}>
            <Bar value={live ? reading.signal : 0} from="var(--teal)" to="var(--sky)" className="bar-thin" />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <DemoNote Icon={Waves}>
          <strong>Demo / mock data.</strong> The waveform and the percentages above are drawn inside your browser to show
          how the feature would look. No headset is connected and no brain activity is being measured.
        </DemoNote>
      </div>
    </section>
  );
}

/* =============================================================
   THE RECALL DRILL
   ============================================================= */
function FocusGame({ eegOn }) {
  const { finishFocusRun, toast } = useApp();
  const reading = useSimulatedEeg(eegOn);
  const attention = useSmoothNumber(reading.attention, { duration: 500 });

  const [phase, setPhase] = useState("idle"); // idle | show | input | feedback | done
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [target, setTarget] = useState(null);
  const [choices, setChoices] = useState([]);
  const [lastOk, setLastOk] = useState(null);
  const [picked, setPicked] = useState(null);

  const timers = useRef([]);
  const savedRef = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const accuracy = attempts ? Math.round((hits / attempts) * 100) : 0;

  const showNewSymbol = () => {
    const t = focusSymbols[Math.floor(Math.random() * focusSymbols.length)];
    setTarget(t);
    setChoices(makeChoices(t));
    setPicked(null);
    setLastOk(null);
    setPhase("show");
    timers.current.push(setTimeout(() => setPhase("input"), SHOW_MS));
  };

  const start = () => {
    clearTimers();
    savedRef.current = false;
    setScore(0);
    setHits(0);
    setAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setRound(1);
    setTimeLeft(ROUND_SECONDS);
    showNewSymbol();
  };

  useEffect(() => {
    if (phase === "idle" || phase === "done") return undefined;
    const id = setInterval(() => {
      setTimeLeft((v) => {
        if (v <= 1) {
          setPhase("done");
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const answer = (sym) => {
    if (phase !== "input" || !target) return;
    const ok = sym.key === target.key;
    const gained = 10 + Math.min(10, streak * 2);

    setPicked(sym.key);
    setLastOk(ok);
    setAttempts((a) => a + 1);
    setPhase("feedback");

    if (ok) {
      setHits((h) => h + 1);
      setScore((s) => s + gained);
      setStreak((s) => {
        const n = s + 1;
        setBestStreak((b) => Math.max(b, n));
        return n;
      });
    } else {
      setStreak(0);
    }

    timers.current.push(
      setTimeout(() => {
        setRound((r) => r + 1);
        showNewSymbol();
      }, ok ? 700 : 1350),
    );
  };

  useEffect(() => {
    if (phase !== "done" || savedRef.current) return;
    savedRef.current = true;
    finishFocusRun({ score, accuracy });
    toast(`Focus session saved — ${score} points at ${accuracy}% accuracy.`, { tone: "ok" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const elapsedPct = ((ROUND_SECONDS - timeLeft) / ROUND_SECONDS) * 100;
  const urgent = timeLeft <= 5 && phase !== "idle" && phase !== "done";

  return (
    <section className="card card-pad" style={{ display: "flex", flexDirection: "column" }}>
      <div className="row-between wrap" style={{ gap: 12 }}>
        <div>
          <div className="eyebrow" style={{ color: "var(--a-play)" }}>
            Challenge
          </div>
          <h3 style={{ fontSize: "1.16rem", marginTop: 8 }}>Tap the symbol that appeared previously</h3>
        </div>
        <DemoBadge label="30 sec drill" title="A short recall task played entirely on your device." />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(112px,1fr))", gap: 10, marginTop: 18 }}>
        <div className="stat" style={{ padding: "12px 14px" }}>
          <span className="k">Time</span>
          <div className="v mono" style={{ color: urgent ? "var(--vermilion)" : "var(--text)" }}>
            {timeLeft}s
          </div>
          <div style={{ marginTop: 7 }}>
            <Bar value={elapsedPct} from={urgent ? "var(--vermilion)" : "var(--saffron)"} to="var(--marigold)" className="bar-thin" />
          </div>
        </div>
        <div className="stat" style={{ padding: "12px 14px" }}>
          <span className="k">Score</span>
          <div className="v mono">{score}</div>
          <div className="faint" style={{ fontSize: "0.7rem", marginTop: 4 }}>
            Round {phase === "idle" ? 0 : round}
          </div>
        </div>
        <div className="stat" style={{ padding: "12px 14px" }}>
          <span className="k">Accuracy</span>
          <div className="v mono">{accuracy}%</div>
          <div className="faint" style={{ fontSize: "0.7rem", marginTop: 4 }}>
            {hits} of {attempts} correct
          </div>
        </div>
        <div className="stat" style={{ padding: "12px 14px" }}>
          <span className="k">Streak</span>
          <div className="v mono row" style={{ gap: 6 }}>
            <Flame size={16} style={{ color: streak >= 3 ? "var(--saffron)" : "var(--text-faint)" }} />
            {streak}
          </div>
          <div className="faint" style={{ fontSize: "0.7rem", marginTop: 4 }}>
            Best {bestStreak}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          marginTop: 18,
          borderRadius: "var(--r-lg)",
          border: "1px solid var(--stroke)",
          background: "radial-gradient(120% 130% at 50% 0%, rgba(255,255,255,0.055), rgba(255,255,255,0.012))",
          minHeight: 296,
          display: "grid",
          placeItems: "center",
          padding: 20,
        }}
      >
        <Stage
          phase={phase}
          target={target}
          choices={choices}
          onAnswer={answer}
          lastOk={lastOk}
          picked={picked}
          onStart={start}
          results={{ score, accuracy, hits, attempts, bestStreak }}
        />
      </div>

      <div className="row-between wrap" style={{ gap: 12, marginTop: 14 }}>
        <span className="row" style={{ gap: 8, fontSize: "0.79rem", color: "var(--text-dim)" }}>
          <Zap size={14} style={{ color: eegOn ? "var(--marigold)" : "var(--text-faint)" }} />
          Focus estimate during play
        </span>
        <span className="row" style={{ gap: 10, minWidth: 200 }}>
          <span className="mono faint" style={{ fontSize: "0.78rem" }}>
            {eegOn ? `${attention}%` : "off"}
          </span>
          <span className="grow">
            <Bar value={eegOn ? attention : 0} from="var(--a-focus)" to="var(--teal)" className="bar-thin" />
          </span>
        </span>
      </div>
      <p className="faint" style={{ fontSize: "0.72rem", marginTop: 8 }}>
        {eegOn
          ? "Simulated estimate — it drifts on its own to show how a real headset would react."
          : "Switch on the EEG demo above and this strip starts moving."}
      </p>
    </section>
  );
}

function Stage({ phase, target, choices, onAnswer, lastOk, picked, onStart, results }) {
  if (phase === "idle") {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 74,
            height: 74,
            margin: "0 auto 16px",
            borderRadius: 22,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,209,102,0.11)",
            border: "1px solid rgba(255,209,102,0.28)",
          }}
        >
          <Timer size={30} style={{ color: "var(--marigold)" }} />
        </div>
        <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>Ready when you are</div>
        <p className="muted" style={{ fontSize: "0.85rem", margin: "8px auto 18px", maxWidth: "44ch", lineHeight: 1.6 }}>
          A symbol appears for a moment. Remember it. Then pick it out of four. Thirty seconds, as many as you can.
        </p>
        <button className="btn btn-primary" onClick={onStart}>
          Start Focus Challenge <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div style={{ textAlign: "center", width: "100%" }}>
        <div className="row" style={{ justifyContent: "center", marginBottom: 14 }}>
          <Ring value={results.accuracy} size={104} stroke={9} from="var(--marigold)" to="var(--saffron)">
            <div>
              <div className="mono" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                {results.accuracy}%
              </div>
              <div className="faint" style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>
                ACCURACY
              </div>
            </div>
          </Ring>
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>Round complete</div>
        <p className="muted" style={{ fontSize: "0.86rem", margin: "8px auto 18px", maxWidth: "46ch", lineHeight: 1.6 }}>
          {results.accuracy >= 80
            ? "Strong recall. Try the Chakravyuha layers next when you want a harder challenge."
            : results.accuracy >= 55
              ? "A solid base. Short rounds usually build recall faster than long ones."
              : "Worth one more round — most people improve noticeably within two attempts."}
        </p>
        <div className="row" style={{ justifyContent: "center", gap: 10 }}>
          <button className="btn btn-primary" onClick={onStart}>
            <RotateCcw size={15} /> Try again
          </button>
          <Link to="/progress" className="btn btn-ghost" style={{ textDecoration: "none" }}>
            See my report
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "show") {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ justifyContent: "center", color: "var(--marigold)" }}>
          Memorise
        </div>
        <div
          key={target?.key}
          style={{
            margin: "18px auto",
            width: 108,
            height: 108,
            borderRadius: 30,
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(150deg, rgba(255,209,102,0.2), rgba(255,159,69,0.06))",
            border: "1px solid rgba(255,209,102,0.4)",
            boxShadow: "0 20px 60px -22px rgba(255,159,69,0.6)",
            animation: "rise .45s var(--ease) both",
          }}
        >
          {target && <target.Icon size={52} style={{ color: "var(--marigold)" }} />}
        </div>
        <p className="muted" style={{ fontSize: "0.86rem" }}>
          Remember this symbol…
        </p>
      </div>
    );
  }

  const feedback = phase === "feedback";
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <div
        className="eyebrow"
        style={{ justifyContent: "center", color: feedback ? (lastOk ? "var(--teal)" : "var(--vermilion)") : "var(--saffron)" }}
      >
        {feedback ? (lastOk ? "Correct" : "Not quite") : "Which one was it?"}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(92px,1fr))",
          gap: 12,
          margin: "18px auto 0",
          maxWidth: 460,
        }}
      >
        {choices.map((c, i) => {
          const isTarget = target && c.key === target.key;
          const wasPicked = picked === c.key;
          let border = "var(--stroke)";
          let bg = "var(--glass)";
          if (feedback && isTarget) {
            border = "rgba(67,217,192,0.6)";
            bg = "rgba(67,217,192,0.13)";
          } else if (feedback && wasPicked) {
            border = "rgba(255,111,77,0.6)";
            bg = "rgba(255,111,77,0.13)";
          }
          return (
            <button
              key={c.key}
              onClick={() => onAnswer(c)}
              disabled={feedback}
              className="card"
              style={{
                padding: "18px 8px 14px",
                borderColor: border,
                background: bg,
                display: "grid",
                placeItems: "center",
                gap: 8,
                cursor: feedback ? "default" : "pointer",
                animation: `rise .3s var(--ease) ${i * 0.04}s both`,
              }}
            >
              <c.Icon size={30} style={{ color: feedback && isTarget ? "var(--teal)" : "var(--text)" }} />
              <span className="faint" style={{ fontSize: "0.66rem", letterSpacing: "0.06em" }}>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {feedback && (
        <div
          className="row"
          style={{
            justifyContent: "center",
            gap: 8,
            marginTop: 18,
            fontSize: "0.86rem",
            color: lastOk ? "var(--teal)" : "var(--text-dim)",
            animation: "rise .3s var(--ease) both",
          }}
        >
          {lastOk ? <CircleCheck size={16} /> : <CircleAlert size={16} />}
          {lastOk ? "Nicely held — next symbol" : `It was the ${target?.label}`}
        </div>
      )}
    </div>
  );
}

/* =============================================================
   PAGE
   ============================================================= */
export default function Focus() {
  const [eegOn, setEegOn] = useState(false);

  useEffect(() => {
    const on = () => setEegOn(true);
    const off = () => setEegOn(false);
    window.addEventListener("bp:eeg-on", on);
    window.addEventListener("bp:eeg-off", off);
    return () => {
      window.removeEventListener("bp:eeg-on", on);
      window.removeEventListener("bp:eeg-off", off);
    };
  }, []);

  const links = useMemo(
    () => [
      { Icon: Timer, label: "Focus Challenge", desc: "Recall drill · 30 sec", active: true },
      { Icon: Car, label: "Focus Drive", desc: "Smart RC car · prototype simulation", to: "/focus/drive" },
    ],
    [],
  );

  return (
    <div className="page">
      <PageHeader
        eyebrow="Focus mode"
        title="FOCUS CHALLENGE"
        sub="Two ways to practise attention: a short recall drill on screen, and a physical driving challenge with the smart RC car."
        accent="var(--a-focus)"
        right={<DemoBadge />}
      />

      <div className="grid stagger" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12, marginBottom: 20 }}>
        {links.map(({ Icon, label, desc, to, active }) =>
          active ? (
            <div key={label} className="card card-pad" style={{ padding: "14px 16px", borderColor: "rgba(255,209,102,0.3)" }}>
              <div className="row" style={{ gap: 11 }}>
                <Icon size={18} style={{ color: "var(--marigold)" }} />
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 600 }}>{label}</div>
                  <div className="faint" style={{ fontSize: "0.74rem" }}>{desc}</div>
                </div>
                <span className="pill pill-accent" style={{ marginLeft: "auto" }}>
                  On this page
                </span>
              </div>
            </div>
          ) : (
            <Link
              key={label}
              to={to}
              className="card card-pad hover-lift"
              style={{ padding: "14px 16px", textDecoration: "none", color: "inherit" }}
            >
              <div className="row" style={{ gap: 11 }}>
                <Icon size={18} style={{ color: "var(--teal)" }} />
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 600 }}>{label}</div>
                  <div className="faint" style={{ fontSize: "0.74rem" }}>{desc}</div>
                </div>
                <ArrowRight size={16} style={{ marginLeft: "auto", color: "var(--text-faint)" }} />
              </div>
            </Link>
          ),
        )}
      </div>

      <div className="grid split">
        <EegPanel />
        <FocusGame eegOn={eegOn} />
      </div>

      <div className="section-gap">
        <div className="card card-pad row wrap" style={{ gap: 16 }}>
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: "rgba(67,217,192,0.12)",
              border: "1px solid rgba(67,217,192,0.28)",
              flex: "none",
            }}
          >
            <Sparkles size={19} style={{ color: "var(--teal)" }} />
          </span>
          <div className="grow" style={{ minWidth: 220 }}>
            <div style={{ fontWeight: 600, fontSize: "0.94rem" }}>Why a headset at all?</div>
            <p className="muted" style={{ fontSize: "0.84rem", marginTop: 5, lineHeight: 1.55 }}>
              In a real build, an attention estimate would let the game quietly make rounds easier or harder while you
              play — so practice stays challenging without you having to think about difficulty.
            </p>
          </div>
          <Cpu size={20} style={{ color: "var(--text-faint)" }} />
        </div>
      </div>
    </div>
  );
}
