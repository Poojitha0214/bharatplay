import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CircleCheck, Circle, Sparkles, ArrowRight, RotateCcw, Quote, Trophy } from "lucide-react";
import { mahabharata } from "../lib/mockData";
import { useApp } from "../lib/store";
import { DemoBadge, PageHeader, Ring } from "../components/ui";

export default function Mahabharata() {
  const { mahabharataBest, finishMini, toast } = useApp();
  const [scene, setScene] = useState(0);
  const [picked, setPicked] = useState(null);
  const [log, setLog] = useState([]);
  const [done, setDone] = useState(false);

  const current = mahabharata.scenes[scene];
  const isLast = scene === mahabharata.scenes.length - 1;

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
  };

  const next = () => {
    const score = log.filter((x) => x).length + (picked !== null && current.options[picked].good ? 1 : 0);
    const final = isLast ? score : null;
    if (isLast) {
      finishMini({ key: "mahabharataBest", score: final });
      toast(`Story complete — ${final} of ${mahabharata.scenes.length} decisions were strong.`, { tone: final >= 2 ? "ok" : "info" });
      setDone(true);
      return;
    }
    setLog((l) => [...l, current.options[picked].good]);
    setScene((s) => s + 1);
    setPicked(null);
  };

  const restart = () => {
    setScene(0);
    setPicked(null);
    setLog([]);
    setDone(false);
  };

  const finalScore = log.filter(Boolean).length + (picked !== null && current.options[picked]?.good ? 1 : 0);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Discover Bharat · Story game"
        title="MAHABHARATA"
        sub="Think like a strategist. Three decisions, one evening before the battle, and no single right path."
        accent="var(--a-play)"
        right={<DemoBadge label="Strategy · Decisions" />}
      />

      <Link to="/play" className="btn btn-soft btn-sm" style={{ marginBottom: 18, textDecoration: "none" }}>
        <ArrowLeft size={15} /> Back to Play
      </Link>

      <div className="grid split">
        <section className="card card-pad motif-top">
          {/* Scene progress */}
          <div className="row-between wrap" style={{ gap: 12, marginBottom: 18 }}>
            <span className="eyebrow" style={{ color: "var(--a-play)" }}>
              {done ? "Story complete" : `Scene ${scene + 1} of ${mahabharata.scenes.length}`}
            </span>
            <div className="row" style={{ gap: 6 }}>
              {mahabharata.scenes.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: i < scene || done ? 22 : 8,
                    height: 6,
                    borderRadius: 99,
                    background: i < scene || done ? "var(--marigold)" : i === scene ? "var(--saffron)" : "rgba(255,255,255,0.14)",
                    transition: "all .4s var(--ease)",
                  }}
                />
              ))}
            </div>
          </div>

          {done ? (
            <div style={{ textAlign: "center", padding: "18px 0" }}>
              <div className="row" style={{ justifyContent: "center", marginBottom: 16 }}>
                <Ring value={(finalScore / mahabharata.scenes.length) * 100} size={112} stroke={9} from="var(--marigold)" to="var(--saffron)">
                  <div>
                    <div className="mono" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                      {finalScore}/{mahabharata.scenes.length}
                    </div>
                    <div className="faint" style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>
                      STRONG CALLS
                    </div>
                  </div>
                </Ring>
              </div>
              <h3 style={{ fontSize: "1.2rem" }}>The morning comes</h3>
              <p className="muted" style={{ fontSize: "0.88rem", margin: "10px auto 20px", maxWidth: "48ch", lineHeight: 1.62 }}>
                {finalScore >= 2
                  ? "You read the field before you moved, and you kept the long game in view. That is the shape of good strategy — and the skill now shows in your report."
                  : "There is no wrong path here, only different ones. Try again and look for the move that helps two days from now, not just today."}
              </p>
              <div className="row wrap" style={{ justifyContent: "center", gap: 10 }}>
                <button className="btn btn-primary" onClick={restart}>
                  <RotateCcw size={15} /> Replay the story
                </button>
                <Link to="/progress" className="btn btn-ghost" style={{ textDecoration: "none" }}>
                  See my report
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="row" style={{ gap: 10 }}>
                <Trophy size={17} style={{ color: "var(--marigold)" }} />
                <h3 style={{ fontSize: "1.22rem" }}>{current.title}</h3>
              </div>

              <p className="lede" style={{ marginTop: 12, fontSize: "0.92rem" }}>
                {current.text}
              </p>

              <div className="grid" style={{ gap: 10, marginTop: 20 }}>
                {current.options.map((o, i) => {
                  let border = "var(--stroke)";
                  let bg = "var(--glass)";
                  let mark = <Circle size={17} style={{ color: "rgba(255,255,255,0.18)" }} />;
                  if (picked !== null) {
                    if (o.good) {
                      border = "rgba(67,217,192,0.55)";
                      bg = "rgba(67,217,192,0.1)";
                      mark = <CircleCheck size={17} style={{ color: "var(--teal)" }} />;
                    } else if (i === picked) {
                      border = "rgba(255,159,69,0.5)";
                      bg = "rgba(255,159,69,0.08)";
                      mark = <Circle size={17} style={{ color: "var(--saffron)" }} />;
                    }
                  }
                  return (
                    <button
                      key={o.label}
                      onClick={() => choose(i)}
                      disabled={picked !== null}
                      className="row"
                      style={{
                        gap: 12,
                        padding: "15px 17px",
                        borderRadius: 16,
                        border: `1px solid ${border}`,
                        background: bg,
                        textAlign: "left",
                        fontSize: "0.92rem",
                        fontWeight: 500,
                        cursor: picked !== null ? "default" : "pointer",
                        transition: "border-color .22s, background .22s, transform .22s var(--ease)",
                        animation: `rise .3s var(--ease) ${i * 0.06}s both`,
                      }}
                    >
                      <span className="grow">{o.label}</span>
                      {mark}
                    </button>
                  );
                })}
              </div>

              {picked !== null && (
                <div
                  style={{
                    marginTop: 18,
                    padding: "16px 18px",
                    borderRadius: 16,
                    background: current.options[picked].good ? "rgba(67,217,192,0.09)" : "rgba(255,159,69,0.09)",
                    border: `1px solid ${current.options[picked].good ? "rgba(67,217,192,0.28)" : "rgba(255,159,69,0.28)"}`,
                    animation: "rise .35s var(--ease) both",
                  }}
                >
                  <div className="row" style={{ gap: 9, marginBottom: 8 }}>
                    <Quote size={16} style={{ color: "var(--marigold)", flex: "none" }} />
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>What happens next</span>
                  </div>
                  <p className="muted" style={{ fontSize: "0.86rem", lineHeight: 1.62 }}>{current.options[picked].result}</p>
                  <div className="row" style={{ gap: 8, marginTop: 11, color: "var(--marigold)" }}>
                    <Sparkles size={14} style={{ flex: "none" }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{current.options[picked].insight}</span>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 20 }}>
                {picked !== null ? (
                  <button className="btn btn-primary" onClick={next}>
                    {isLast ? "See the outcome" : "Next scene"} <ArrowRight size={16} />
                  </button>
                ) : (
                  <span className="faint" style={{ fontSize: "0.82rem" }}>
                    Choose how you would handle it. There is no single correct answer — there is a well-reasoned one.
                  </span>
                )}
              </div>
            </>
          )}
        </section>

        <div className="stack" style={{ "--gap": "16px" }}>
          <section className="card card-pad">
            <div className="eyebrow" style={{ color: "var(--marigold)" }}>
              The setup
            </div>
            <p className="muted" style={{ fontSize: "0.87rem", marginTop: 10, lineHeight: 1.65 }}>{mahabharata.intro}</p>
          </section>

          <section className="card card-pad">
            <div className="eyebrow" style={{ color: "var(--teal)" }}>
              Your record
            </div>
            <div className="row" style={{ gap: 14, marginTop: 12 }}>
              <Ring value={((mahabharataBest || 0) / mahabharata.scenes.length) * 100} size={78} stroke={7} from="var(--marigold)" to="var(--saffron)">
                <div className="mono" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                  {mahabharataBest}/3
                </div>
              </Ring>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>Strongest decisions</div>
                <p className="faint" style={{ fontSize: "0.76rem", marginTop: 5, lineHeight: 1.55 }}>
                  {mahabharataBest ? "Your best run so far. Replay to improve it." : "Finish the story once to record a score."}
                </p>
              </div>
            </div>
          </section>

          <section className="card card-pad">
            <div className="eyebrow" style={{ color: "var(--rose)" }}>
              Skills in play
            </div>
            <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
              {["Decision making", "Strategy", "Reading people", "Planning"].map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
