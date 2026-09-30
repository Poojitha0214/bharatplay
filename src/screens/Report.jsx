import { useEffect, useMemo, useRef, useState } from "react";
import {
  Brain,
  Target,
  Puzzle,
  ChartLine,
  Palette,
  Hammer,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Download,
  Check,
  Loader,
  Info,
  Trophy,
  Flame,
} from "lucide-react";
import { insightBank } from "../lib/mockData";
import { useApp, useSmoothNumber } from "../lib/store";
import { Bar, DemoBadge, DemoNote, PageHeader, Ring } from "../components/ui";

const ICONS = {
  brain: Brain,
  target: Target,
  puzzle: Puzzle,
  strategy: ChartLine,
  palette: Palette,
  craft: Hammer,
};

const GRADIENTS = {
  brain: ["#93a6ff", "#6cc6ff"],
  target: ["#43d9c0", "#6cc6ff"],
  puzzle: ["#ffd166", "#ff9f45"],
  strategy: ["#ffd166", "#43d9c0"],
  palette: ["#ff8fb1", "#ffd166"],
  craft: ["#ff9f45", "#ff6f4d"],
};

const SERIES = [
  { key: "focus", label: "Focus", color: "#93a6ff" },
  { key: "strategy", label: "Strategy", color: "#43d9c0" },
  { key: "creativity", label: "Creativity", color: "#ff8fb1" },
  { key: "accuracy", label: "Accuracy", color: "#ffd166" },
];

const W = 620;
const H = 220;
const PAD = { l: 34, r: 14, t: 16, b: 26 };

/* =============================================================
   SEVEN-SESSION CHART
   ============================================================= */
function SessionChart({ sessions }) {
  const [hidden, setHidden] = useState([]);
  const [hover, setHover] = useState(null);
  const wrapRef = useRef(null);

  const visible = SERIES.filter((s) => !hidden.includes(s.key));
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const x = (i) => PAD.l + (innerW / (sessions.length - 1)) * i;
  const y = (v) => PAD.t + innerH - ((v - 40) / 60) * innerH;

  const line = (key) => visible.map((s, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(sessions[i][key])}`).join(" ");

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestD = Infinity;
    sessions.forEach((_, i) => {
      const d = Math.abs(x(i) - px);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setHover(best);
  };

  return (
    <section className="card card-pad">
      <div className="row-between wrap" style={{ gap: 12, marginBottom: 16 }}>
        <div>
          <div className="eyebrow" style={{ color: "var(--teal)" }}>
            Last 7 sessions
          </div>
          <h3 style={{ fontSize: "1.14rem", marginTop: 8 }}>Progress over time</h3>
        </div>
        <div className="row wrap" style={{ gap: 7 }}>
          {SERIES.map((s) => {
            const off = hidden.includes(s.key);
            return (
              <button
                key={s.key}
                className="chip"
                onClick={() => setHidden((h) => (off ? h.filter((k) => k !== s.key) : [...h, s.key]))}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                  opacity: off ? 0.45 : 1,
                  borderColor: off ? "var(--stroke)" : `${s.color}55`,
                  color: off ? "var(--text-faint)" : s.color,
                }}
              >
                <span className="dot" style={{ background: s.color }} />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={wrapRef} style={{ position: "relative" }} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
          <defs>
            {SERIES.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={s.color} stopOpacity="0.26" />
                <stop offset="1" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* gridlines */}
          {[40, 55, 70, 85, 100].map((v) => (
            <g key={v}>
              <line x1={PAD.l} y1={y(v)} x2={W - PAD.r} y2={y(v)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x={PAD.l - 9} y={y(v) + 3.5} textAnchor="end" fontSize="9.5" fill="rgba(255,255,255,0.3)" fontFamily="Outfit, sans-serif">
                {v}
              </text>
            </g>
          ))}

          {sessions.map((_, i) => (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="9.5" fill="rgba(255,255,255,0.32)" fontFamily="Outfit, sans-serif">
              {sessions[i].label}
            </text>
          ))}

          {visible.map((s) => (
            <path key={`a-${s.key}`} d={`${line(s.key)} L ${x(sessions.length - 1)} ${PAD.t + innerH} L ${x(0)} ${PAD.t + innerH} Z`} fill={`url(#grad-${s.key})`} />
          ))}

          {visible.map((s) => (
            <path
              key={`l-${s.key}`}
              d={line(s.key)}
              fill="none"
              stroke={s.color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 6px ${s.color}44)`, transition: "d .6s var(--ease)" }}
            />
          ))}

          {hover !== null && (
            <g>
              <line x1={x(hover)} y1={PAD.t} x2={x(hover)} y2={PAD.t + innerH} stroke="rgba(255,255,255,0.28)" strokeWidth="1" strokeDasharray="3 3" />
              {visible.map((s) => (
                <circle key={s.key} cx={x(hover)} cy={y(sessions[hover][s.key])} r="4" fill="#07202b" stroke={s.color} strokeWidth="2.2" />
              ))}
            </g>
          )}
        </svg>

        {hover !== null && (
          <div
            className="card"
            style={{
              position: "absolute",
              top: 6,
              left: `${(x(hover) / W) * 100}%`,
              transform: "translateX(-50%)",
              padding: "10px 13px",
              pointerEvents: "none",
              minWidth: 148,
              zIndex: 2,
              background: "rgba(9,28,38,0.96)",
            }}
          >
            <div style={{ fontSize: "0.74rem", fontWeight: 600, marginBottom: 6 }}>{sessions[hover].label}</div>
            {visible.map((s) => (
              <div key={s.key} className="row-between" style={{ gap: 14, fontSize: "0.74rem", marginTop: 3 }}>
                <span className="row" style={{ gap: 6 }}>
                  <span className="dot" style={{ background: s.color }} />
                  <span className="faint">{s.label}</span>
                </span>
                <span className="mono">{sessions[hover][s.key]}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="faint" style={{ fontSize: "0.73rem", marginTop: 12 }}>
        Sessions S1–S6 are sample history for the demo. S7 is this browser's session and changes as you play.
      </p>
    </section>
  );
}

/* =============================================================
   AI INSIGHT
   ============================================================= */
function AiInsight({ insight, onRegenerate }) {
  const [phase, setPhase] = useState("thinking"); // thinking | ready

  useEffect(() => {
    const t = setTimeout(() => setPhase("ready"), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="card card-pad motif-top" style={{ background: "linear-gradient(160deg, rgba(255,209,102,0.09), rgba(255,255,255,0.02))" }}>
      <div className="row-between wrap" style={{ gap: 12 }}>
        <div className="row" style={{ gap: 12 }}>
          <span className="ai-orb" />
          <div>
            <div className="eyebrow" style={{ color: "var(--marigold)" }}>
              AI insight
            </div>
            <h3 style={{ fontSize: "1.12rem", marginTop: 6 }}>
              {phase === "thinking" ? "Reading your last seven sessions…" : insight.headline}
            </h3>
          </div>
        </div>
        <button className="btn btn-soft btn-sm" onClick={onRegenerate} disabled={phase === "thinking"}>
          <RefreshCw size={14} className={phase === "thinking" ? "spin" : ""} /> Regenerate
        </button>
      </div>

      {phase === "thinking" ? (
        <div className="grid" style={{ gap: 10, marginTop: 20 }}>
          {[92, 78, 60].map((w) => (
            <span key={w} className="skel" style={{ height: 13, width: `${w}%` }} />
          ))}
          <div className="row" style={{ gap: 8, marginTop: 6, color: "var(--text-faint)", fontSize: "0.76rem" }}>
            <Loader size={13} className="spin" /> Comparing focus scores, accuracy and strategy answers…
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 18, animation: "rise .5s var(--ease) both" }}>
          <p className="muted" style={{ fontSize: "0.92rem", lineHeight: 1.68, maxWidth: "66ch" }}>
            {insight.body}
          </p>
          <div className="row wrap" style={{ gap: 9, marginTop: 18 }}>
            <span className="pill pill-accent">
              <Trophy size={12} /> Strongest: {insight.strongest.label} · {insight.strongest.value}%
            </span>
            <span className="pill">
              <TrendingUp size={12} /> Next focus: {insight.focus}
            </span>
            <span className="pill">
              <Flame size={12} /> Room to grow: {insight.weakest.label} · {insight.weakest.value}%
            </span>
          </div>
          <div style={{ marginTop: 16 }}>
            <DemoNote Icon={Sparkles}>
              <strong>AI-generated prototype insight.</strong> This text was written by hand for the demo and selected
              by a simple rule. In a real build an on-device model would produce it from your gameplay and attention data.
            </DemoNote>
          </div>
        </div>
      )}
    </section>
  );
}

/* =============================================================
   PAGE
   ============================================================= */
export default function Report() {
  const { report, insight, sessions, playCount, minutes, finishMini } = useApp();
  const [insightRun, setInsightRun] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);

  const cycle = insightBank[insightRun % insightBank.length];
  const activeInsight = useMemo(
    () => ({ ...insight, headline: cycle.title, body: cycle.body, focus: cycle.focus }),
    [insight, cycle],
  );

  const download = () => {
    setDownloading(true);
    const lines = [
      "BHARATPLAY — PROGRESS SUMMARY (prototype demo)",
      "All values below are sample data generated in the browser.",
      "",
      ...report.map((r) => `${r.label}: ${r.value}% — ${r.note}`),
      "",
      "SEVEN SESSION TREND",
      ...sessions.map((s) => `${s.label}: focus ${s.focus}% · strategy ${s.strategy}% · creativity ${s.creativity}% · accuracy ${s.accuracy}%`),
      "",
      "AI-GENERATED PROTOTYPE INSIGHT",
      `${activeInsight.headline}`,
      activeInsight.body,
      "",
      `Activities played: ${playCount}`,
      `Minutes in the app: ${minutes}`,
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bharatplay-progress-demo.txt";
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => {
      setDownloading(false);
      setSaved(true);
    }, 900);
  };

  const avg = Math.round(report.reduce((a, r) => a + r.value, 0) / report.length);

  return (
    <div className="page">
      <PageHeader
        eyebrow="My progress"
        title="MY BHARATPLAY REPORT"
        sub="Six skills, seven sessions, and one clear next step — built from your gameplay and, in a full build, from attention estimates too."
        accent="var(--teal)"
        right={
          <div className="row wrap" style={{ gap: 8 }}>
            <DemoBadge label="Sample + session data" />
            <button className="btn btn-ghost btn-sm" onClick={download} disabled={downloading}>
              {downloading ? <Loader size={14} className="spin" /> : saved ? <Check size={14} /> : <Download size={14} />}
              {saved ? "Saved" : "Download summary"}
            </button>
          </div>
        }
      />

      {/* Headline */}
      <section className="card card-pad motif-top" style={{ marginBottom: 18 }}>
        <div className="row wrap" style={{ gap: 22 }}>
          <Ring value={avg} size={118} stroke={10} from="var(--teal)" to="var(--sky)">
            <div style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: "1.7rem", fontWeight: 600, lineHeight: 1 }}>
                {avg}
              </div>
              <div className="faint" style={{ fontSize: "0.58rem", letterSpacing: "0.12em" }}>
                OVERALL
              </div>
            </div>
          </Ring>

          <div className="grow" style={{ minWidth: 240 }}>
            <div className="eyebrow" style={{ color: "var(--marigold)" }}>
              Overall picture
            </div>
            <h2 style={{ fontSize: "1.32rem", marginTop: 8, lineHeight: 1.3 }}>
              Your strongest area is {insight.strongest.label.toLowerCase()} at {insight.strongest.value}%.
            </h2>
            <p className="muted" style={{ fontSize: "0.88rem", marginTop: 9, lineHeight: 1.6, maxWidth: "62ch" }}>
              {playCount === 0
                ? "Nothing played yet in this browser. Finish any activity and this page updates immediately — the numbers you see now are the demo's starting point."
                : `${playCount} ${playCount === 1 ? "activity" : "activities"} played and ${minutes} minutes in the app. Everything on this page recalculates as you play.`}
            </p>
            <div className="row wrap" style={{ gap: 8, marginTop: 16 }}>
              <span className="pill">
                <Flame size={12} /> 7-session trend tracked
              </span>
              <span className="pill">
                <Info size={12} /> S7 updates live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Six skills */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14 }}>
        {report.map((r) => (
          <MetricCard key={r.key} metric={r} />
        ))}
      </div>

      <div className="section-gap grid split">
        <SessionChart sessions={sessions} />

        <div className="stack" style={{ "--gap": "16px" }}>
          <AiInsight key={insightRun} insight={activeInsight} onRegenerate={() => setInsightRun((r) => r + 1)} />

          <section className="card card-pad">
            <div className="eyebrow" style={{ color: "var(--sky)" }}>
              What goes into this report
            </div>
            <ul style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {[
                ["Gameplay", "Correct answers, response time, levels cleared."],
                ["Craft", "Line accuracy and steadiness from Create mode."],
                ["Attention estimate", "Sample EEG values per session — simulated here."],
                ["Session length", "How long you practised without a break."],
              ].map(([k, v]) => (
                <li key={k} className="row" style={{ gap: 10, alignItems: "flex-start" }}>
                  <span className="dot dot-live" style={{ marginTop: 6 }} />
                  <span style={{ fontSize: "0.83rem", lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 600 }}>{k}.</span> <span className="muted">{v}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="row" style={{ gap: 8, marginTop: 14 }}>
              <button
                className="btn btn-soft btn-sm"
                onClick={() => finishMini({ key: "focusBest", score: 42 })}
                title="Adds a small sample activity to the demo data"
              >
                Add a sample session
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ metric }) {
  const shown = useSmoothNumber(metric.value, { duration: 1000 });
  const Icon = ICONS[metric.Icon] ?? Brain;
  const [from, to] = GRADIENTS[metric.Icon] ?? GRADIENTS.brain;

  return (
    <div className="metric">
      <div className="row-between">
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 11,
            display: "grid",
            placeItems: "center",
            background: `linear-gradient(140deg, ${from}33, rgba(255,255,255,0.02))`,
            border: `1px solid ${from}44`,
            flex: "none",
          }}
        >
          <Icon size={16} style={{ color: to }} />
        </span>
        <span className="mono" style={{ fontSize: "0.7rem", color: "var(--text-faint)" }}>
          +{Math.max(1, Math.round(metric.value / 16))}
        </span>
      </div>
      <div className="row" style={{ gap: 8, marginTop: 14, alignItems: "baseline" }}>
        <span className="mono" style={{ fontSize: "1.6rem", fontWeight: 600, letterSpacing: "-0.03em" }}>
          {shown}%
        </span>
      </div>
      <div style={{ fontSize: "0.88rem", fontWeight: 600, marginTop: 2 }}>{metric.label}</div>
      <p className="faint" style={{ fontSize: "0.74rem", marginTop: 6, lineHeight: 1.45 }}>{metric.note}</p>
      <div style={{ marginTop: 12 }}>
        <Bar value={metric.value} from={from} to={to} className="bar-thin" />
      </div>
    </div>
  );
}
