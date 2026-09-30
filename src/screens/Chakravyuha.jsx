import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  CircleCheck,
  Circle,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Compass,
} from "lucide-react";
import { chakraCentre, chakraLayers } from "../lib/mockData";
import { useApp } from "../lib/store";
import { Modal, ModalHead } from "../components/Modal";
import { DemoBadge, PageHeader } from "../components/ui";

const VIEW = 420;
const CENTRE = VIEW / 2;
const MAX_R = 180;
const MIN_R = 36;
const RING_STEP = (MAX_R - MIN_R) / chakraLayers.length;

const ringRadius = (i) => MAX_R - RING_STEP * (i + 0.5);
const BADGE_ANGLE = 0; // 3 o'clock
const TOKEN_ANGLE = -0.55;

export default function Chakravyuha() {
  const { chakraUnlocked, chakraBest, finishChakra, toast } = useApp();
  const [openLayer, setOpenLayer] = useState(null);
  const [solved, setSolved] = useState([]);

  const unlocked = useMemo(() => {
    const base = Math.max(1, Math.min(5, chakraUnlocked));
    return Math.min(chakraLayers.length, Math.max(base, solved.length + (solved.length ? 1 : 0)));
  }, [chakraUnlocked, solved]);

  const tokenAt = Math.min(chakraLayers.length, solved.length);
  const finished = solved.length === chakraLayers.length;

  const correctTotal = solved.reduce((a, s) => a + s.correct, 0);

  const onLayerResult = ({ correct }) => {
    const layerIndex = openLayer;
    setSolved((prev) => {
      const next = [...prev];
      next[layerIndex] = { ...next[layerIndex], correct, total: chakraLayers[layerIndex].questions.length };
      return next;
    });
    finishChakra({ solved: layerIndex + 1, correct: correctTotal + correct });
    if (layerIndex === chakraLayers.length - 1) {
      toast(`You reached the centre of Chakravyuha.`, { tone: "ok" });
    }
  };

  const resetRun = () => {
    setSolved([]);
    setTokenAt(0);
    setFinished(false);
    setOpenLayer(null);
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Discover Bharat · Game"
        title="Chakravyuha"
        sub="The wheel has five rings and a centre. Each ring asks for a different kind of thinking — work your way in."
        accent="var(--a-focus)"
        right={
          <div className="row wrap" style={{ gap: 8 }}>
            <DemoBadge label={chakraBest ? `Best ${chakraBest}/5 layers` : "New run"} />
            <button className="btn btn-ghost btn-sm" onClick={resetRun}>
              <RotateCcw size={14} /> Reset wheel
            </button>
          </div>
        }
      />

      <Link to="/play" className="btn btn-soft btn-sm" style={{ marginBottom: 18, textDecoration: "none" }}>
        <ArrowLeft size={15} /> Back to Play
      </Link>

      <div className="grid split">
        {/* ---------------- THE WHEEL ---------------- */}
        <section className="card card-pad" style={{ display: "grid", placeItems: "center" }}>
          <div className="wheel-spin" style={{ width: "100%", maxWidth: 470 }}>
            <svg viewBox={`0 0 ${VIEW} ${VIEW}`} style={{ width: "100%", height: "auto", display: "block" }}>
              <defs>
                <radialGradient id="wheel-core" cx="0.5" cy="0.45" r="0.6">
                  <stop offset="0" stopColor="#ffe6b0" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#ff9f45" stopOpacity="0.03" />
                </radialGradient>
              </defs>

              <circle cx={CENTRE} cy={CENTRE} r={MAX_R + 6} fill="none" stroke="rgba(255,255,255,0.05)" />
              <circle cx={CENTRE} cy={CENTRE} r={MIN_R + 10} fill="url(#wheel-core)" />

              {/* tick marks */}
              {Array.from({ length: 48 }).map((_, i) => {
                const a = (i / 48) * Math.PI * 2;
                const long = i % 4 === 0;
                const r1 = MAX_R + 4;
                const r2 = r1 - (long ? 11 : 5);
                return (
                  <line
                    key={i}
                    x1={CENTRE + Math.cos(a) * r1}
                    y1={CENTRE + Math.sin(a) * r1}
                    x2={CENTRE + Math.cos(a) * r2}
                    y2={CENTRE + Math.sin(a) * r2}
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* rings, outermost first */}
              {chakraLayers.map((layer, i) => {
                const r = ringRadius(i);
                const isOpen = i < unlocked;
                const isDone = Boolean(solved[i]);
                const active = openLayer === i;
                const colour = layer.color;

                return (
                  <g
                    key={layer.n}
                    className={isOpen ? "chakra-hit" : "chakra-hit locked"}
                    onClick={() => isOpen && setOpenLayer(i)}
                  >
                    <circle
                      className="chakra-ring"
                      cx={CENTRE}
                      cy={CENTRE}
                      r={r}
                      fill={active ? `${colour}26` : isDone ? `${colour}16` : "rgba(255,255,255,0.012)"}
                      stroke={isOpen ? `${colour}99` : "rgba(255,255,255,0.1)"}
                      strokeWidth={active ? 3 : 1.6}
                      strokeDasharray={isOpen ? undefined : "5 9"}
                    />
                    {/* generous invisible hit area */}
                    <circle cx={CENTRE} cy={CENTRE} r={r} fill="transparent" stroke="transparent" strokeWidth="30" />
                  </g>
                );
              })}

              {/* numbered badges */}
              {chakraLayers.map((layer, i) => {
                const r = ringRadius(i);
                const isOpen = i < unlocked;
                const isDone = Boolean(solved[i]);
                const bx = CENTRE + Math.cos(BADGE_ANGLE) * r;
                const by = CENTRE + Math.sin(BADGE_ANGLE) * r;
                return (
                  <g key={`b-${layer.n}`} style={{ pointerEvents: "none" }}>
                    <circle cx={bx} cy={by} r="11" fill="#07202b" stroke={isOpen ? layer.color : "rgba(255,255,255,0.18)"} strokeWidth="1.5" />
                    {isOpen ? (
                      <text
                        x={bx}
                        y={by + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill={isDone ? "var(--teal)" : layer.color}
                        fontFamily="Outfit, sans-serif"
                      >
                        {isDone ? "✓" : layer.n}
                      </text>
                    ) : (
                      <g style={{ color: "rgba(255,255,255,0.35)" }}>
                        <Lock size={12} x={bx - 6} y={by - 6} />
                      </g>
                    )}
                  </g>
                );
              })}

              {/* centre */}
              <g style={{ pointerEvents: "none" }}>
                <circle
                  cx={CENTRE}
                  cy={CENTRE}
                  r={MIN_R}
                  fill={finished ? "rgba(255,209,102,0.16)" : "rgba(255,255,255,0.03)"}
                  stroke={finished ? "rgba(255,209,102,0.7)" : "rgba(255,255,255,0.16)"}
                  strokeWidth="1.5"
                />
                <text
                  x={CENTRE}
                  y={CENTRE - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill={finished ? "var(--marigold)" : "rgba(255,255,255,0.4)"}
                  fontFamily="Outfit, sans-serif"
                  fontWeight="600"
                  letterSpacing="1"
                >
                  CENTRE
                </text>
                <text
                  x={CENTRE}
                  y={CENTRE + 10}
                  textAnchor="middle"
                  fontSize="9"
                  fill="rgba(255,255,255,0.45)"
                  fontFamily="Outfit, sans-serif"
                >
                  {finished ? "reached" : "not yet"}
                </text>
              </g>

              <Token at={tokenAt} reached={finished} />
            </svg>
          </div>

          <p className="faint" style={{ fontSize: "0.76rem", marginTop: 14, textAlign: "center", maxWidth: "46ch", lineHeight: 1.55 }}>
            Tap a numbered ring to open its challenge. Answer well and your token steps inward. Nothing here is violent —
            it is a story about choosing well.
          </p>
        </section>

        {/* ---------------- SIDE PANEL ---------------- */}
        <div className="stack" style={{ "--gap": "16px" }}>
          <section className="card card-pad">
            <div className="row-between">
              <div>
                <div className="eyebrow" style={{ color: "var(--marigold)" }}>
                  This run
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 600, marginTop: 8 }}>
                  {solved.length} of {chakraLayers.length} layers cleared
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                  {correctTotal}
                </div>
                <div className="faint" style={{ fontSize: "0.64rem", letterSpacing: "0.12em" }}>
                  CORRECT
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
              {chakraLayers.map((l, i) => {
                const s = solved[i];
                const open = i < unlocked;
                return (
                  <button
                    key={l.n}
                    onClick={() => open && setOpenLayer(i)}
                    className="row"
                    style={{
                      gap: 12,
                      padding: "11px 13px",
                      borderRadius: 14,
                      border: `1px solid ${s ? `${l.color}44` : open ? "var(--stroke)" : "rgba(255,255,255,0.05)"}`,
                      background: s ? `${l.color}12` : "var(--glass)",
                      opacity: open ? 1 : 0.55,
                      cursor: open ? "pointer" : "not-allowed",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        display: "grid",
                        placeItems: "center",
                        background: `${l.color}1f`,
                        color: l.color,
                        flex: "none",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      {s ? <CircleCheck size={16} /> : open ? l.n : <Lock size={14} />}
                    </span>
                    <span className="grow" style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: "0.88rem", fontWeight: 500 }}>{l.name}</span>
                      <span className="faint" style={{ fontSize: "0.74rem" }}>
                        {s ? `Cleared · ${s.correct} of ${s.total} correct` : open ? "Ready" : "Clear the previous layer first"}
                      </span>
                    </span>
                    {open && !s && <ArrowRight size={15} style={{ color: "var(--text-faint)" }} />}
                  </button>
                );
              })}
            </div>
          </section>

          {finished && (
            <section className="card card-pad motif-top" style={{ borderColor: "rgba(255,209,102,0.35)" }}>
              <div className="row" style={{ gap: 11 }}>
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(255,209,102,0.16)",
                    border: "1px solid rgba(255,209,102,0.32)",
                    flex: "none",
                  }}
                >
                  <Sparkles size={18} style={{ color: "var(--marigold)" }} />
                </span>
                <div style={{ fontWeight: 600 }}>{chakraCentre.name}</div>
              </div>
              <p className="muted" style={{ fontSize: "0.86rem", marginTop: 10, lineHeight: 1.6 }}>
                {chakraCentre.text}
              </p>
              <div className="row wrap" style={{ gap: 10, marginTop: 16 }}>
                <button className="btn btn-primary btn-sm" onClick={resetRun}>
                  <RotateCcw size={14} /> Ride the wheel again
                </button>
                <Link to="/progress" className="btn btn-ghost btn-sm" style={{ textDecoration: "none" }}>
                  My report
                </Link>
              </div>
            </section>
          )}

          <section className="card card-pad">
            <div className="row" style={{ gap: 10 }}>
              <Compass size={17} style={{ color: "var(--teal)" }} />
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Where this comes from</span>
            </div>
            <p className="muted" style={{ fontSize: "0.84rem", marginTop: 9, lineHeight: 1.6 }}>
              Chakravyuha is the wheel-shaped battlefield described in the Mahabharata. Here it becomes a calm puzzle: one
              skill per ring, and the centre is reached by thinking rather than fighting.
            </p>
          </section>
        </div>
      </div>

      <LayerModal
        key={openLayer ?? "closed"}
        index={openLayer}
        unlocked={unlocked}
        onClose={() => setOpenLayer(null)}
        onResult={onLayerResult}
      />
    </div>
  );
}

function Token({ at, reached }) {
  const clamped = Math.max(0, Math.min(chakraLayers.length, at));
  const r = clamped === 0 ? MAX_R + 2 : ringRadius(clamped - 1);
  const angle = TOKEN_ANGLE + clamped * 0.42;
  const x = CENTRE + Math.cos(angle) * r;
  const y = CENTRE + Math.sin(angle) * r;
  const fade = clamped === 0 ? 0.55 : 1;

  return (
    <g style={{ pointerEvents: "none", transform: `translate(${x}px, ${y}px)`, transition: "transform .85s cubic-bezier(.22,1,.36,1)" }}>
      <circle r="14" fill="rgba(255,209,102,0.16)" opacity={fade} />
      <circle r="14" fill="none" stroke={reached ? "#ffd166" : "#ff9f45"} strokeWidth="1.2" strokeOpacity={0.55 * fade} />
      <circle r="7.5" fill="#ffd166" opacity={fade} />
      <circle r="7.5" fill="none" stroke="#05121a" strokeWidth="1.6" />
    </g>
  );
}

/* =============================================================
   CHALLENGE MODAL
   ============================================================= */
function LayerModal({ index, unlocked, onClose, onResult }) {
  const layer = index !== null ? chakraLayers[index] : null;
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState(null);
  const [tally, setTally] = useState({ correct: 0, total: 0 });
  const [locked, setLocked] = useState(false);

  if (!layer) return null;

  const q = layer.questions[qi];
  const answered = picked !== null;
  const ok = picked === q.answer;
  const needed = Math.ceil(layer.questions.length / 2);
  const passed = tally.correct >= needed;

  const choose = (i) => {
    if (answered) return;
    setPicked(i);
    setTally((t) => ({ correct: t.correct + (i === q.answer ? 1 : 0), total: t.total + 1 }));
  };

  const next = () => {
    if (qi < layer.questions.length - 1) {
      setQi((i) => i + 1);
      setPicked(null);
      return;
    }
    setLocked(true);
    onResult({ correct: tally.correct, total: tally.total });
    setTimeout(onClose, 1700);
  };

  const isLastLayer = index === chakraLayers.length - 1;

  return (
    <Modal open={Boolean(layer)} onClose={onClose} labelledBy="modal-title">
      <ModalHead onClose={onClose} accent={layer.color} sub={`Ring ${layer.n} of ${chakraLayers.length} · ${layer.name}`} title={layer.name} />
      <div className="modal-body">
        <p className="muted" style={{ fontSize: "0.87rem", lineHeight: 1.6, marginBottom: 18 }}>{layer.ring}</p>

        <div className="row-between" style={{ marginBottom: 12 }}>
          <span className="pill" style={{ borderColor: `${layer.color}44`, color: layer.color }}>
            Question {qi + 1} of {layer.questions.length}
          </span>
          <span className="mono faint" style={{ fontSize: "0.78rem" }}>
            {tally.correct} correct · {needed} needed
          </span>
        </div>

        <h3 style={{ fontSize: "1.1rem", lineHeight: 1.42, marginBottom: 18 }}>{q.q}</h3>

        <div className="grid" style={{ gap: 10 }}>
          {q.options.map((opt, i) => {
            let border = "var(--stroke)";
            let bg = "var(--glass)";
            let mark = <Circle size={17} style={{ color: "rgba(255,255,255,0.18)" }} />;
            if (answered) {
              if (i === q.answer) {
                border = "rgba(67,217,192,0.55)";
                bg = "rgba(67,217,192,0.11)";
                mark = <CircleCheck size={17} style={{ color: "var(--teal)" }} />;
              } else if (i === picked) {
                border = "rgba(255,111,77,0.55)";
                bg = "rgba(255,111,77,0.1)";
                mark = <Circle size={17} style={{ color: "var(--vermilion)" }} />;
              }
            }
            return (
              <button
                key={opt}
                onClick={() => choose(i)}
                disabled={answered}
                className="row"
                style={{
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 15,
                  border: `1px solid ${border}`,
                  background: bg,
                  textAlign: "left",
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  cursor: answered ? "default" : "pointer",
                  transition: "border-color .22s, background .22s, transform .22s var(--ease)",
                  animation: `rise .3s var(--ease) ${i * 0.05}s both`,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 8,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid var(--stroke-2)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    flex: "none",
                    color: "var(--text-dim)",
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="grow">{opt}</span>
                {mark}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            style={{
              marginTop: 18,
              padding: "16px 18px",
              borderRadius: 16,
              background: ok ? "rgba(67,217,192,0.09)" : "rgba(255,159,69,0.09)",
              border: `1px solid ${ok ? "rgba(67,217,192,0.28)" : "rgba(255,159,69,0.28)"}`,
              animation: "rise .35s var(--ease) both",
            }}
          >
            <div className="row" style={{ gap: 9 }}>
              {ok ? (
                <CircleCheck size={17} style={{ color: "var(--teal)", flex: "none" }} />
              ) : (
                <Sparkles size={17} style={{ color: "var(--saffron)", flex: "none" }} />
              )}
              <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>{ok ? "That's right" : "Here's the reasoning"}</span>
            </div>
            <p className="muted" style={{ fontSize: "0.86rem", marginTop: 9, lineHeight: 1.62 }}>{q.why}</p>
          </div>
        )}

        <div className="row wrap" style={{ gap: 10, marginTop: 20 }}>
          {answered ? (
            <>
              <button className="btn btn-primary grow" onClick={next} disabled={locked}>
                {locked
                  ? "Unlocking…"
                  : qi < layer.questions.length - 1
                    ? "Next question"
                    : passed
                      ? isLastLayer
                        ? "Reach the centre"
                        : "Unlock the next ring"
                      : "Close this ring"}
              </button>
              {!passed && !locked && (
                <button className="btn btn-ghost" onClick={onClose}>
                  Step away
                </button>
              )}
            </>
          ) : (
            <span className="faint" style={{ fontSize: "0.8rem" }}>Choose one answer — you will see why.</span>
          )}
        </div>

        {!passed && answered && !locked && (
          <p className="faint" style={{ fontSize: "0.76rem", marginTop: 12 }}>
            Get {needed} of {layer.questions.length} right to unlock the next ring. Ring {Math.min(chakraLayers.length, unlocked + 1)} stays
            locked until then.
          </p>
        )}
      </div>
    </Modal>
  );
}
