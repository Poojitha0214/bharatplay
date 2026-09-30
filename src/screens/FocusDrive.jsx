import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  BrainCircuit,
  Signal,
  Battery,
  Gauge,
  TriangleAlert,
  CircleCheck,
  Flag,
  RotateCcw,
  Play as PlayIcon,
  Square,
  Waves,
  Keyboard,
  Target,
  Radio,
} from "lucide-react";
import { useApp, useSmoothNumber } from "../lib/store";
import { useSimulatedBattery, useSimulatedEeg } from "../lib/useSimulated";
import { Bar, DemoBadge, DemoNote, PageHeader } from "../components/ui";

/* A gentle closed circuit the car follows. */
const TRACK =
  "M 18 30 Q 18 18 32 18 L 68 18 Q 82 18 82 30 L 82 68 Q 82 80 68 80 L 32 80 Q 18 80 18 68 Z";
const VIEW = 100;
const CHECKPOINTS = [0.25, 0.5, 0.75];
export default function FocusDrive() {
  const { driveBest, finishDrive, toast } = useApp();
  const pathRef = useRef(null);
  const lengthRef = useRef(1);
  const posRef = useRef(0);
  const speedRef = useRef(0);

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0); // 0..100
  const [speed, setSpeed] = useState(0);
  const [checkpoints, setCheckpoints] = useState(0);
  const [finished, setFinished] = useState(false);
  const [keys, setKeys] = useState({ up: false, left: false, right: false, down: false });
  const [dip, setDip] = useState(false);
  const [track, setTrack] = useState([]); // pre-sampled points along the track

  const eegOn = useEegFlag();
  const reading = useSimulatedEeg(eegOn);
  const attention = useSmoothNumber(reading.attention, { duration: 500 });
  const battery = useSimulatedBattery(running, 86);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const L = p.getTotalLength();
    lengthRef.current = L;
    const N = 260;
    const pts = [];
    let prevAngle = 0;
    for (let i = 0; i < N; i += 1) {
      const here = p.getPointAtLength((i / N) * L);
      const ahead = p.getPointAtLength((((i + 1) % N) / N) * L);
      let a = (Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180) / Math.PI;
      // unwrap so the car never spins the long way round
      if (i > 0) {
        while (a - prevAngle > 180) a -= 360;
        while (a - prevAngle < -180) a += 360;
      }
      prevAngle = a;
      pts.push({ x: here.x, y: here.y, a });
    }
    setTrack(pts);
  }, []);

  /* ---------------- driving loop ---------------- */
  useEffect(() => {
    if (!running) return undefined;
    let raf;
    let last = performance.now();

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const attn = reading.attention;
      // Simulated: attention sets the top speed. A real build would read the headset.
      const maxSpeed = 5.2 + (attn / 100) * 12;
      let target = 0;
      if (keys.up) target = maxSpeed;
      else if (keys.down) target = -maxSpeed * 0.4;
      if (keys.left || keys.right) target *= 0.55;

      const k = target === 0 ? 3.2 : 2.1;
      speedRef.current += (target - speedRef.current) * Math.min(1, dt * k);
      if (Math.abs(speedRef.current) < 0.02) speedRef.current = 0;

      posRef.current += (speedRef.current / lengthRef.current) * dt * 100;
      if (posRef.current >= 100) posRef.current -= 100;
      if (posRef.current < 0) posRef.current += 100;

      setSpeed(speedRef.current);
      setProgress(posRef.current);

      const reached = CHECKPOINTS.filter((c) => posRef.current >= c).length;
      setCheckpoints(reached);
      setDip(attn < 58);

      if (posRef.current >= 99.6) {
        setRunning(false);
        setFinished(true);
        finishDrive({ percent: 100, checkpoints: reached });
        toast("Track complete. Focus held through the whole lap.", { tone: "ok" });
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, keys, reading.attention, finishDrive, toast]);

  /* ---------------- keyboard ---------------- */
  useEffect(() => {
    const map = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    const down = (e) => {
      const k = map[e.key];
      if (!k) return;
      e.preventDefault();
      setKeys((p) => ({ ...p, [k]: true }));
    };
    const up = (e) => {
      const k = map[e.key];
      if (!k) return;
      e.preventDefault();
      setKeys((p) => ({ ...p, [k]: false }));
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const start = useCallback(() => {
    if (finished) {
      posRef.current = 0;
      speedRef.current = 0;
      setProgress(0);
      setCheckpoints(0);
      setFinished(false);
    }
    setRunning(true);
  }, [finished]);

  const stop = useCallback(() => {
    setRunning(false);
    speedRef.current = 0;
    setSpeed(0);
  }, []);

  const carPos = useMemo(() => sampleTrack(track, progress), [track, progress]);
  const checkPts = useMemo(() => CHECKPOINTS.map((c) => sampleTrack(track, c * 100)), [track]);

  const press = (k) => (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setKeys((p) => ({ ...p, [k]: true }));
  };
  const release = (k) => () => setKeys((p) => ({ ...p, [k]: false }));

  return (
    <div className="page">
      <PageHeader
        eyebrow="Focus · Smart toy"
        title="FOCUS DRIVE"
        sub="A small physical track, a real RC car and one job: stay steady. Attention sets how responsive the car feels."
        accent="var(--teal)"
        right={
          <div className="row wrap" style={{ gap: 8 }}>
            <DemoBadge label="Prototype simulation" />
            {driveBest > 0 && <span className="pill pill-live">Best {Math.round(driveBest)}%</span>}
          </div>
        }
      />

      <Link to="/focus" className="btn btn-soft btn-sm" style={{ marginBottom: 18, textDecoration: "none" }}>
        <ArrowLeft size={15} /> Back to Focus
      </Link>

      <div className="grid split">
        {/* ---------------- TRACK ---------------- */}
        <section className="card card-pad">
          <div className="row-between wrap" style={{ gap: 12, marginBottom: 14 }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--teal)" }}>
                Virtual track
              </div>
              <h3 style={{ fontSize: "1.14rem", marginTop: 8 }}>Three checkpoints, one lap</h3>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn-teal btn-sm" onClick={start}>
                <PlayIcon size={14} /> {finished ? "Drive again" : running ? "Running" : "Start"}
              </button>
              <button className="btn btn-soft btn-sm" onClick={stop}>
                <Square size={13} /> Stop
              </button>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              borderRadius: "var(--r-lg)",
              border: "1px solid var(--stroke)",
              background: "radial-gradient(120% 110% at 50% 10%, rgba(67,217,192,0.07), rgba(255,255,255,0.012))",
              overflow: "hidden",
            }}
          >
            <svg viewBox={`0 0 ${VIEW} ${VIEW}`} style={{ width: "100%", height: "auto", display: "block" }}>
              <defs>
                <linearGradient id="track-bed" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#43d9c0" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#93a6ff" stopOpacity="0.14" />
                </linearGradient>
              </defs>

              {/* grass-ish base markings */}
              {Array.from({ length: 9 }).map((_, i) => (
                <circle key={i} cx={14 + i * 9} cy={90 - (i % 3) * 5} r="1.1" fill="rgba(255,255,255,0.05)" />
              ))}

              <path ref={pathRef} d={TRACK} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7.5" strokeLinecap="round" />
              <path d={TRACK} fill="none" stroke="url(#track-bed)" strokeWidth="5.6" strokeLinecap="round" />
              <path
                d={TRACK}
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.28"
                strokeDasharray="1.6 2.4"
                strokeLinecap="round"
              />

              {/* travelled portion */}
              <path
                d={TRACK}
                fill="none"
                stroke="#ffd166"
                strokeWidth="0.7"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray={`${progress} 100`}
                style={{ transition: "stroke-dashoffset .12s linear", filter: "drop-shadow(0 0 2px rgba(255,209,102,0.7))" }}
              />

              {/* checkpoints */}
              {checkPts.map((c, i) => (
                <g key={i} style={{ pointerEvents: "none" }}>
                  <circle cx={c.x} cy={c.y} r="2.6" fill={c.done ? "rgba(255,209,102,0.24)" : "rgba(255,255,255,0.06)"} />
                  <circle cx={c.x} cy={c.y} r="1.5" fill={c.done ? "#ffd166" : "rgba(255,255,255,0.35)"} />
                </g>
              ))}

              {/* start / finish */}
              <g style={{ pointerEvents: "none" }}>
                <circle cx={18} cy={30} r="3" fill="rgba(255,255,255,0.1)" />
                <circle cx={18} cy={30} r="1.7" fill="rgba(255,255,255,0.6)" />
              </g>

              {/* the car */}
              <g
                style={{
                  transform: `translate(${carPos.x}px, ${carPos.y}px) rotate(${carPos.a}deg)`,
                  transition: "transform .09s linear",
                  pointerEvents: "none",
                }}
              >
                <ellipse cx="0" cy="2.6" rx="4.4" ry="1.7" fill="rgba(0,0,0,0.42)" />
                <rect x="-3.6" y="-2.4" width="7.2" height="4.6" rx="1.5" fill="#ff6f4d" />
                <rect x="-2.2" y="-1.9" width="4" height="2.4" rx="0.9" fill="#ffd7a8" />
                <rect x="-3.4" y="-3.1" width="6.8" height="0.9" rx="0.45" fill="#ffd166" />
                <circle cx="-2.4" cy="2.1" r="1.05" fill="#12222c" />
                <circle cx="2.4" cy="2.1" r="1.05" fill="#12222c" />
                <circle cx="-2.4" cy="-2.1" r="1.05" fill="#12222c" />
                <circle cx="2.4" cy="-2.1" r="1.05" fill="#12222c" />
                {running && (
                  <circle cx="0" cy="-3.1" r="0.7" fill="#fff" opacity="0.85">
                    <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            </svg>

            {/* controls */}
            <div
              style={{
                position: "absolute",
                inset: "auto 0 0 0",
                padding: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                background: "linear-gradient(180deg, transparent, rgba(5,18,26,0.86))",
              }}
            >
              <div className="row" style={{ gap: 8 }}>
                <span className="pill pill-accent">
                  <Flag size={12} /> {checkpoints}/3
                </span>
                <span className="pill mono">{progress.toFixed(0)}%</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,34px)", gridTemplateRows: "repeat(2,32px)", gap: 5 }}>
                <span />
                <button className="dpad" data-on={keys.up} onPointerDown={press("up")} onPointerUp={release("up")} onPointerLeave={release("up")} onPointerCancel={release("up")} aria-label="Accelerate">
                  <span className="caret">↑</span>
                </button>
                <span />
                <button className="dpad" data-on={keys.left} onPointerDown={press("left")} onPointerUp={release("left")} onPointerLeave={release("left")} onPointerCancel={release("left")} aria-label="Steer left">
                  <span className="caret">←</span>
                </button>
                <button className="dpad" data-on={keys.down} onPointerDown={press("down")} onPointerUp={release("down")} onPointerLeave={release("down")} onPointerCancel={release("down")} aria-label="Reverse">
                  <span className="caret">↓</span>
                </button>
                <button className="dpad" data-on={keys.right} onPointerDown={press("right")} onPointerUp={release("right")} onPointerLeave={release("right")} onPointerCancel={release("right")} aria-label="Steer right">
                  <span className="caret">→</span>
                </button>
              </div>
            </div>
          </div>

          <div className="row-between wrap" style={{ gap: 12, marginTop: 14 }}>
            <span className="row" style={{ gap: 8, fontSize: "0.78rem", color: "var(--text-dim)" }}>
              <Gauge size={14} style={{ color: "var(--teal)" }} /> Speed
            </span>
            <span className="row" style={{ gap: 10, minWidth: 190 }}>
              <span className="mono faint" style={{ fontSize: "0.78rem" }}>
                {Math.abs(speed).toFixed(1)}
              </span>
              <span className="grow">
                <Bar value={(Math.abs(speed) / 18) * 100} from="var(--teal)" to="var(--sky)" className="bar-thin" />
              </span>
            </span>
          </div>

          <div className="row wrap" style={{ gap: 8, marginTop: 14 }}>
            <span className="pill">
              <Keyboard size={13} /> Arrow keys or WASD
            </span>
            <span className="pill">
              <Target size={13} /> Hold ↑ to accelerate
            </span>
          </div>

          {finished && (
            <div
              className="card card-pad"
              style={{
                marginTop: 16,
                borderColor: "rgba(67,217,192,0.32)",
                background: "rgba(67,217,192,0.07)",
                animation: "rise .45s var(--ease) both",
              }}
            >
              <div className="row" style={{ gap: 11 }}>
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(67,217,192,0.16)",
                    border: "1px solid rgba(67,217,192,0.3)",
                    flex: "none",
                  }}
                >
                  <CircleCheck size={18} style={{ color: "var(--teal)" }} />
                </span>
                <div>
                  <div style={{ fontWeight: 600 }}>Lap complete</div>
                  <div className="faint" style={{ fontSize: "0.78rem", marginTop: 3 }}>
                    3 of 3 checkpoints · focus and control scores updated
                  </div>
                </div>
              </div>
              <div className="row wrap" style={{ gap: 10, marginTop: 14 }}>
                <button className="btn btn-teal btn-sm" onClick={start}>
                  <RotateCcw size={14} /> Drive again
                </button>
                <Link to="/progress" className="btn btn-ghost btn-sm" style={{ textDecoration: "none" }}>
                  See the report
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ---------------- PANELS ---------------- */}
        <div className="stack" style={{ "--gap": "16px" }}>
          <section className="card card-pad motif-top">
            <div className="row-between">
              <div className="row" style={{ gap: 10 }}>
                <BrainCircuit size={18} style={{ color: "var(--a-focus)" }} />
                <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>EEG status</span>
              </div>
              <span className={eegOn ? "pill pill-live" : "pill"}>
                <span className={`dot ${eegOn ? "dot-live" : "dot-idle"}`} />
                {eegOn ? "Simulated" : "Not connected"}
              </span>
            </div>

            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
              <div className="stat" style={{ padding: "12px 14px" }}>
                <span className="k">Attention</span>
                <div className="v mono">{eegOn ? `${attention}%` : "—"}</div>
                <div style={{ marginTop: 7 }}>
                  <Bar value={eegOn ? attention : 0} from="var(--a-focus)" to="var(--teal)" className="bar-thin" />
                </div>
              </div>
              <div className="stat" style={{ padding: "12px 14px" }}>
                <span className="k">Signal</span>
                <div className="v" style={{ fontSize: "1.2rem" }}>
                  {eegOn ? (reading.signal > 78 ? "Stable" : "Noisy") : "—"}
                </div>
                <div className="row" style={{ gap: 6, marginTop: 6 }}>
                  <Signal size={13} style={{ color: eegOn ? "var(--teal)" : "var(--text-faint)" }} />
                  <span className="faint" style={{ fontSize: "0.7rem" }}>
                    {eegOn ? `${reading.signal}% quality` : "Demo values"}
                  </span>
                </div>
              </div>
            </div>

            {dip && running && (
              <div
                className="row"
                style={{
                  gap: 9,
                  marginTop: 12,
                  padding: "10px 13px",
                  borderRadius: 13,
                  background: "rgba(255,159,69,0.1)",
                  border: "1px solid rgba(255,159,69,0.28)",
                  fontSize: "0.78rem",
                  color: "var(--saffron-soft)",
                }}
              >
                <TriangleAlert size={15} style={{ flex: "none" }} />
                Focus dip detected — the car responds more slowly. Steadier focus, faster car.
              </div>
            )}

            {!eegOn && (
              <div
                className="row wrap"
                style={{
                  gap: 12,
                  marginTop: 12,
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px dashed var(--stroke-2)",
                }}
              >
                <div className="grow" style={{ minWidth: 180 }}>
                  <div style={{ fontSize: "0.84rem", fontWeight: 600 }}>No EEG demo running</div>
                  <div className="faint" style={{ fontSize: "0.75rem", marginTop: 3, lineHeight: 1.5 }}>
                    Switch on the simulated headset to make the car respond to the sample attention value.
                  </div>
                </div>
                <Link className="btn btn-teal btn-sm" to="/focus">
                  <Radio size={14} /> How to connect
                </Link>
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <DemoNote Icon={Waves}>
                <strong>Prototype simulation.</strong> The attention value above is a generated sample, not a brain
                measurement. It is used here only to show how the car would react.
              </DemoNote>
            </div>
          </section>

          <section className="card card-pad">
            <div className="row-between">
              <div className="row" style={{ gap: 10 }}>
                <Car size={18} style={{ color: "var(--vermilion)" }} />
                <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>RC car</span>
              </div>
              <span className="pill pill-accent">
                <span className="dot dot-live" /> Demo connected
              </span>
            </div>

            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
              <div className="stat" style={{ padding: "12px 14px" }}>
                <span className="k">Connection</span>
                <div className="v" style={{ fontSize: "1.05rem" }}>
                  Demo connected
                </div>
              </div>
              <div className="stat" style={{ padding: "12px 14px" }}>
                <span className="k">Battery</span>
                <div className="v mono row" style={{ gap: 7 }}>
                  <Battery size={16} style={{ color: battery > 30 ? "var(--teal)" : "var(--vermilion)" }} />
                  {battery.toFixed(0)}%
                </div>
                <div style={{ marginTop: 7 }}>
                  <Bar value={battery} from="var(--teal)" to="var(--sky)" className="bar-thin" />
                </div>
              </div>
            </div>

            <p className="faint" style={{ fontSize: "0.74rem", marginTop: 12, lineHeight: 1.55 }}>
              Battery drains slowly while driving and refills when you restart the lap — all in the page, no hardware.
            </p>
          </section>

          <section className="card card-pad">
            <div className="row" style={{ gap: 10 }}>
              <TriangleAlert size={16} style={{ color: "var(--marigold)" }} />
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Focus → Control → Complete</span>
            </div>
            <div className="grid" style={{ gap: 9, marginTop: 12 }}>
              {[
                ["Focus", "Attention estimate stays high (simulated)."],
                ["Control", "Steer with arrows; a dip slows the response."],
                ["Complete", "Reach all three checkpoints to finish the lap."],
              ].map(([k, v], i) => (
                <div key={k} className="row" style={{ gap: 11, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 8,
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(255,209,102,0.13)",
                      border: "1px solid rgba(255,209,102,0.28)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--marigold)",
                      flex: "none",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{k}</div>
                    <div className="faint" style={{ fontSize: "0.78rem", marginTop: 2, lineHeight: 1.5 }}>
                      {v}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function useEegFlag() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const yes = () => setOn(true);
    const no = () => setOn(false);
    window.addEventListener("bp:eeg-on", yes);
    window.addEventListener("bp:eeg-off", no);
    return () => {
      window.removeEventListener("bp:eeg-on", yes);
      window.removeEventListener("bp:eeg-off", no);
    };
  }, []);
  return on;
}

/** Interpolate a position/angle along the pre-sampled track. */
function sampleTrack(track, pct) {
  if (!track.length) return { x: 50, y: 50, a: 0 };
  const n = track.length;
  const t = (((pct % 100) + 100) % 100) / 100;
  const idx = t * n;
  const i0 = Math.floor(idx) % n;
  const i1 = (i0 + 1) % n;
  const f = idx - Math.floor(idx);
  const a = track[i0];
  const b = track[i1];
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    a: a.a + (b.a - a.a) * f,
  };
}
