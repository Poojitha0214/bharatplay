import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Hammer,
  Gem,
  CircleCheck,
  RotateCcw,
  Waves,
  Cpu,
  Activity,
  Gauge,
  TriangleAlert,
  Hand,
  Target,
  Timer,
  Sparkles,
  Info,
} from "lucide-react";
import { craftGuides } from "../lib/mockData";
import { useApp, useSmoothNumber } from "../lib/store";
import { useSimulatedSensor } from "../lib/useSimulated";
import { Bar, DemoBadge, DemoNote, PageHeader } from "../components/ui";

const TOLERANCE = 7.5; // viewBox units
const KINDS = [
  { id: "pottery", label: "Pottery", Icon: Gem, accent: "#ff9f45" },
  { id: "carving", label: "Carving", Icon: Hammer, accent: "#ffb877" },
];

function toPoints(list) {
  return list.map(([x, y]) => ({ x, y }));
}

function pathD(points, close) {
  if (!points.length) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }
  if (close) d += " Z";
  return d;
}

/* =============================================================
   CRAFT TRACE
   ============================================================= */
function CraftTrace({ kind, onComplete, accent }) {
  const svgRef = useRef(null);
  const guideRef = useRef(null);
  const samples = useRef([]);
  const lastSampleAt = useRef(0);
  const startedAt = useRef(null);
  const doneRef = useRef(false);

  const craft = craftGuides[kind];
  const [guideIndex, setGuideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [touching, setTouching] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);

  const guides = useMemo(() => craft.guides.map((g) => ({ ...g, pts: toPoints(g.points) })), [craft]);
  const finished = guideIndex >= guides.length;
  const guide = guides[Math.min(guideIndex, guides.length - 1)];
  // One mutable Set per guide segment, created up front so tracing works on first load.
  const marked = useMemo(() => guides.map(() => new Set()), [guides]);

  const computeAccuracy = useCallback(() => {
    const s = samples.current;
    if (!s.length) return 0;
    const avg = s.reduce((a, b) => a + b, 0) / s.length;
    return Math.round(Math.max(0, Math.min(100, (1 - avg / TOLERANCE) * 100)));
  }, []);

  const reset = useCallback(() => {
    marked.forEach((set) => set.clear());
    samples.current = [];
    doneRef.current = false;
    startedAt.current = null;
    setGuideIndex(0);
    setProgress(0);
    setAccuracy(0);
    setElapsed(0);
    setStarted(false);
  }, [marked]);

  useEffect(() => {
    if (!startedAt.current || finished) return undefined;
    const id = setInterval(() => setElapsed(Math.round((Date.now() - startedAt.current) / 1000)), 500);
    return () => clearInterval(id);
  }, [finished, touching, progress]);

  const finish = () => {
    doneRef.current = true;
    setGuideIndex(guides.length);
    setProgress(100);
    const secs = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    onComplete({ accuracy: computeAccuracy(), timeSec: secs });
  };

  const onPointerMove = (e) => {
    if (!touching || finished || doneRef.current) return;
    const svg = svgRef.current;
    const path = guideRef.current;
    if (!svg || !path) return;

    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    const L = path.getTotalLength();
    if (!L) return;

    let bestT = 0;
    let bestD = Infinity;
    const STEPS = 72;
    for (let i = 0; i <= STEPS; i += 1) {
      const t = i / STEPS;
      const pt = path.getPointAtLength(t * L);
      const d = Math.hypot(px - pt.x, py - pt.y);
      if (d < bestD) {
        bestD = d;
        bestT = t;
      }
    }

    if (bestD > TOLERANCE) return;

    const now = performance.now();
    if (now - lastSampleAt.current > 30) {
      lastSampleAt.current = now;
      samples.current.push(bestD);
      setAccuracy(computeAccuracy());
    }

    const segs = Math.max(14, Math.round(L / 3));
    const idx = Math.min(segs - 1, Math.floor(bestT * segs));
    const mark = marked[guideIndex];
    if (!mark) return;

    const before = mark.size;
    for (let k = Math.max(0, idx - 1); k <= Math.min(segs - 1, idx + 1); k += 1) mark.add(k);
    const after = mark.size;
    if (after === before) return;

    const p = Math.min(100, Math.round((after / segs) * 100));
    setProgress(p);

    if (after / segs > 0.92) {
      if (guideIndex + 1 >= guides.length) finish();
      else {
        setGuideIndex(guideIndex + 1);
        setProgress(0);
      }
    }
  };

  const totalProgress = finished ? 100 : Math.round(((guideIndex + progress / 100) / guides.length) * 100);
  const shownAccuracy = useSmoothNumber(accuracy, { duration: 400 });

  return (
    <section className="card card-pad">
      <div className="row-between wrap" style={{ gap: 12, marginBottom: 14 }}>
        <div>
          <div className="eyebrow" style={{ color: accent }}>
            {finished ? "Complete" : `Guide ${guideIndex + 1} of ${guides.length}`}
          </div>
          <h3 style={{ fontSize: "1.14rem", marginTop: 8 }}>{finished ? `${craft.label} finished` : guide.name}</h3>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <span className="pill pill-accent">{totalProgress}% traced</span>
          <button className="icon-btn" onClick={reset} aria-label="Restart craft">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="row" style={{ gap: 8, marginBottom: 12 }}>
        {guides.map((g, i) => (
          <span key={g.name} style={{ flex: 1 }}>
            <span className="bar bar-thin" style={{ display: "block" }}>
              <i
                style={{
                  width: i < guideIndex ? "100%" : i === guideIndex ? `${progress}%` : "2%",
                  "--b1": accent,
                  "--b2": "#ffd166",
                }}
              />
            </span>
            <span className="faint" style={{ fontSize: "0.66rem", display: "block", marginTop: 5, textAlign: "center" }}>
              {g.name}
            </span>
          </span>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          borderRadius: "var(--r-lg)",
          border: "1px solid var(--stroke)",
          background:
            kind === "pottery"
              ? "radial-gradient(120% 110% at 50% 15%, rgba(255,159,69,0.09), rgba(255,255,255,0.012))"
              : "radial-gradient(120% 110% at 50% 15%, rgba(255,184,119,0.08), rgba(255,255,255,0.012))",
          overflow: "hidden",
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            touchAction: "none",
            cursor: touching ? "crosshair" : "grab",
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture?.(e.pointerId);
            if (!startedAt.current) startedAt.current = Date.now();
            setStarted(true);
            setTouching(true);
          }}
          onPointerUp={() => setTouching(false)}
          onPointerCancel={() => setTouching(false)}
          onPointerLeave={() => setTouching(false)}
          onPointerMove={onPointerMove}
        >
          <ellipse cx="50" cy="90" rx="26" ry="3.4" fill="rgba(0,0,0,0.3)" />

          {guides.map((g, i) =>
            i < guideIndex ? (
              <path
                key={g.name}
                d={pathD(g.pts, true)}
                fill="none"
                stroke={accent}
                strokeWidth="1.1"
                strokeOpacity="0.42"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ) : null,
          )}

          {!finished && (
            <>
              <path
                d={pathD(guide.pts, true)}
                fill="none"
                stroke="rgba(255,255,255,0.26)"
                strokeWidth="0.5"
                strokeDasharray="2 2.4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={pathD(guide.pts, true)}
                fill="none"
                stroke={accent}
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                pathLength="100"
                strokeDasharray={`${progress} 100`}
                style={{ transition: "stroke-dasharray .22s linear", filter: `drop-shadow(0 0 4px ${accent}88)` }}
              />
              <path ref={guideRef} d={pathD(guide.pts, true)} fill="none" stroke="transparent" strokeWidth="0.4" />
              <circle cx={guide.pts[0].x} cy={guide.pts[0].y} r="1.6" fill="#ffd166" />
              <circle cx={guide.pts[0].x} cy={guide.pts[0].y} r="3" fill="none" stroke="#ffd166" strokeWidth="0.4" strokeOpacity="0.5">
                <animate attributeName="r" values="2.4;4.6;2.4" dur="2s" repeatCount="indefinite" />
                <animate attributeName="strokeOpacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          {finished && (
            <g>
              <circle cx="50" cy="50" r="26" fill="rgba(255,209,102,0.1)" stroke="rgba(255,209,102,0.5)" strokeWidth="0.5" />
              <text
                x="50"
                y="53"
                textAnchor="middle"
                fontSize="7"
                fontFamily="Outfit, sans-serif"
                fontWeight="600"
                fill="var(--marigold)"
              >
                NICELY DONE
              </text>
            </g>
          )}
        </svg>

        {!touching && totalProgress === 0 && (
          <div style={{ position: "absolute", inset: "auto 0 14px 0", display: "grid", placeItems: "center", pointerEvents: "none" }}>
            <span className="pill" style={{ background: "rgba(5,18,26,0.82)" }}>
              <Hand size={13} /> Press and drag along the dotted line
            </span>
          </div>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10, marginTop: 16 }}>
        <div className="stat" style={{ padding: "12px 14px" }}>
          <span className="k">Accuracy</span>
          <div className="v mono">{shownAccuracy}%</div>
          <div style={{ marginTop: 7 }}>
            <Bar value={shownAccuracy} from={accent} to="#ffd166" className="bar-thin" />
          </div>
        </div>
        <div className="stat" style={{ padding: "12px 14px" }}>
          <span className="k">Completion</span>
          <div className="v mono">{totalProgress}%</div>
          <div style={{ marginTop: 7 }}>
            <Bar value={totalProgress} from="var(--teal)" to="var(--sky)" className="bar-thin" />
          </div>
        </div>
        <div className="stat" style={{ padding: "12px 14px" }}>
          <span className="k">Time</span>
          <div className="v mono">{elapsed}s</div>
          <div className="faint" style={{ fontSize: "0.68rem", marginTop: 5 }}>
            {started ? "Measuring" : "Starts on first touch"}
          </div>
        </div>
      </div>

      <p className="muted" style={{ fontSize: "0.84rem", marginTop: 14, lineHeight: 1.6 }}>
        {craft.hint}
      </p>
    </section>
  );
}

/* =============================================================
   SMART CRAFT KIT — simulated sensor panel
   ============================================================= */
function CraftKitPanel() {
  const [sensorsOn, setSensorsOn] = useState(false);
  const motion = useSimulatedSensor({ key: "motion", min: 6, max: 170, active: sensorsOn, speed: 0.28, seed: 1 });
  const pressure = useSimulatedSensor({ key: "pressure", min: 0.4, max: 11, active: sensorsOn, speed: 0.22, seed: 2 });
  const temp = useSimulatedSensor({ key: "temp", min: 18, max: 38, active: sensorsOn, speed: 0.1, seed: 3 });

  const live = { motion, pressure, temp };

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
              background: "rgba(255,159,69,0.13)",
              border: "1px solid rgba(255,159,69,0.28)",
              flex: "none",
            }}
          >
            <Cpu size={20} style={{ color: "var(--a-create)" }} />
          </span>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.98rem" }}>Smart craft kit</div>
            <div className="faint" style={{ fontSize: "0.76rem" }}>
              {sensorsOn ? "Simulated readings streaming…" : "Demo mode — kit not connected"}
            </div>
          </div>
        </div>
        <button className={`btn btn-sm ${sensorsOn ? "btn-soft" : "btn-teal"}`} onClick={() => setSensorsOn((v) => !v)}>
          {sensorsOn ? (
            "Stop sensor data"
          ) : (
            <>
              <Activity size={14} /> Simulate sensor data
            </>
          )}
        </button>
      </div>

      <div className="grid" style={{ gap: 12, marginTop: 16 }}>
        <SensorRow
          label="Motion sensor"
          Icon={Activity}
          value={live.motion}
          unit="mm/s"
          min={0}
          max={180}
          active={sensorsOn}
          accent="var(--sky)"
          note="How fast the hand is moving"
        />
        <SensorRow
          label="Pressure sensor"
          Icon={Gauge}
          value={live.pressure}
          unit="N"
          min={0}
          max={12}
          active={sensorsOn}
          accent="var(--marigold)"
          note="How firmly the tool is pressed"
        />
        <SensorRow
          label="Clay temperature"
          Icon={Waves}
          value={live.temp}
          unit="°C"
          min={15}
          max={40}
          active={sensorsOn}
          accent="var(--vermilion)"
          note="Keeps the clay workable"
        />
      </div>

      <div style={{ marginTop: 14 }}>
        <DemoNote Icon={TriangleAlert}>
          <strong>Simulated readings.</strong> The motion, pressure and temperature values above are produced by a small
          generator in this page. No ESP32 or sensor board is connected to your browser.
        </DemoNote>
      </div>

      <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
        <span className="pill pill-demo">ESP32 · demo</span>
        <span className="pill pill-demo">Motion · demo</span>
        <span className="pill pill-demo">Pressure · demo</span>
      </div>
    </section>
  );
}

function SensorRow({ label, Icon, value, unit, min, max, active, accent, note }) {
  const v = value ?? 0;
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <div
      style={{
        padding: "13px 15px",
        borderRadius: 15,
        background: "var(--glass)",
        border: `1px solid ${active ? `${accent}33` : "var(--stroke)"}`,
      }}
    >
      <div className="row-between" style={{ gap: 10 }}>
        <span className="row" style={{ gap: 9, fontSize: "0.85rem", fontWeight: 500 }}>
          <Icon size={15} style={{ color: active ? accent : "var(--text-faint)" }} />
          {label}
        </span>
        <span className="row" style={{ gap: 7 }}>
          <span className="mono" style={{ fontSize: "0.92rem" }}>
            {active ? v : "—"}
          </span>
          <span className="faint" style={{ fontSize: "0.72rem" }}>
            {unit}
          </span>
        </span>
      </div>
      <div style={{ marginTop: 9 }}>
        <Bar value={active ? pct : 0} from={accent} to="#ffd166" className="bar-thin" />
      </div>
      <div className="row-between" style={{ marginTop: 7 }}>
        <span className="faint" style={{ fontSize: "0.7rem" }}>
          {note}
        </span>
        <span className="pill" style={{ fontSize: "0.6rem", padding: "2px 8px" }}>
          {active ? "DEMO" : "OFF"}
        </span>
      </div>
    </div>
  );
}

/* =============================================================
   PAGE
   ============================================================= */
export default function Create() {
  const { craftAccuracy, craftsCompleted, finishCraft, toast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("craft") === "carving" ? "carving" : "pottery";
  const [kind, setKind] = useState(requested);
  const [result, setResult] = useState(null);
  const current = KINDS.find((k) => k.id === kind);

  const pick = (id) => {
    setKind(id);
    setResult(null);
    setSearchParams(id === "pottery" ? {} : { craft: id }, { replace: true });
  };

  const complete = ({ accuracy, timeSec }) => {
    finishCraft({ kind, accuracy, timeSec });
    setResult({ accuracy, timeSec, kind });
    toast(`${craftGuides[kind].label} finished — ${accuracy}% line accuracy.`, { tone: "ok" });
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Create"
        title="CREATE WITH BHARATPLAY"
        sub="Traditional crafts as skill games. Trace the guide the way a craftsperson would work — slowly, evenly, with a steady hand."
        accent="var(--a-create)"
        right={<DemoBadge label="Guided trace" />}
      />

      <div className="row wrap" style={{ gap: 10, marginBottom: 20 }}>
        {KINDS.map(({ id, label, Icon, accent }) => {
          const done = craftsCompleted[id] || 0;
          const best = craftAccuracy[id] || 0;
          return (
            <button
              key={id}
              onClick={() => pick(id)}
              className={`chip ${kind === id ? "on" : ""}`}
              style={kind === id ? undefined : { display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Icon size={15} />
              {label}
              {done > 0 && <span style={{ opacity: 0.7, fontSize: "0.72rem" }}>· {done}×</span>}
              {done > 0 && (
                <span
                  className="mono"
                  style={{ fontSize: "0.68rem", opacity: 0.75, color: kind === id ? "#241004" : "var(--teal)" }}
                >
                  {best}%
                </span>
              )}
              {kind === id && (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 99,
                    background: accent,
                    marginLeft: 2,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {result && (
        <div
          className="card card-pad row wrap"
          style={{
            gap: 16,
            marginBottom: 18,
            borderColor: "rgba(255,209,102,0.34)",
            background: "rgba(255,209,102,0.06)",
            animation: "rise .45s var(--ease) both",
          }}
        >
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,209,102,0.18)",
              border: "1px solid rgba(255,209,102,0.34)",
              flex: "none",
            }}
          >
            <CircleCheck size={20} style={{ color: "var(--marigold)" }} />
          </span>
          <div className="grow" style={{ minWidth: 220 }}>
            <div style={{ fontWeight: 600 }}>Your {craftGuides[result.kind].label.toLowerCase()} guide is complete</div>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: 5, lineHeight: 1.55 }}>
              {result.accuracy >= 85
                ? "Very even lines. This is the steadiness a craftsperson actually needs."
                : result.accuracy >= 65
                  ? "A good trace. Try again for a smoother line and a higher craft score."
                  : "Worth another pass — slow down at the curves and the accuracy climbs quickly."}
            </p>
          </div>
          <div className="row wrap" style={{ gap: 10 }}>
            <span className="pill pill-accent">
              <Target size={13} /> {result.accuracy}% accuracy
            </span>
            <span className="pill">
              <Timer size={13} /> {result.timeSec}s
            </span>
          </div>
        </div>
      )}

      <div className="grid split">
        <CraftTrace key={kind} kind={kind} accent={current.accent} onComplete={complete} />
        <div className="stack" style={{ "--gap": "16px" }}>
          <CraftKitPanel />

          <section className="card card-pad">
            <div className="row" style={{ gap: 10 }}>
              <Sparkles size={17} style={{ color: "var(--marigold)" }} />
              <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>Why trace at all?</span>
            </div>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: 10, lineHeight: 1.62 }}>
              A potter's wheel and a carving knife both ask for the same thing: a hand that does not rush. The trace
              measures steadiness rather than speed, which is exactly the skill a real craft needs.
            </p>
            <div className="row wrap" style={{ gap: 8, marginTop: 14 }}>
              {["Hand control", "Patience", "Line accuracy", "Creativity"].map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="card card-pad">
            <div className="row" style={{ gap: 10 }}>
              <Info size={16} style={{ color: "var(--teal)" }} />
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>How the trace is scored</span>
            </div>
            <ul style={{ marginTop: 12, display: "grid", gap: 9 }}>
              {[
                "Your finger or cursor is sampled as it moves.",
                "Points close to the guide line count as on-target.",
                "Accuracy is the share of your movement that stayed on the line.",
                "Completion is how much of the guide you have covered.",
              ].map((t) => (
                <li key={t} className="row" style={{ gap: 9, alignItems: "flex-start", fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.5 }}>
                  <span className="dot dot-live" style={{ marginTop: 6 }} />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <Link to="/focus" className="btn btn-soft btn-sm" style={{ textDecoration: "none" }}>
          <ArrowLeft size={15} /> Back to Focus
        </Link>
      </div>
    </div>
  );
}
