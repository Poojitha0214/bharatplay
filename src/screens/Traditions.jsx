import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CircleCheck, RotateCcw, Sparkles, ArrowRight, Flame } from "lucide-react";
import { traditionPairs } from "../lib/mockData";
import { useApp } from "../lib/store";
import { DemoBadge, PageHeader, Ring } from "../components/ui";

function buildDeck() {
  const cards = traditionPairs.flatMap((p) => [
    { key: `${p.id}-a`, pairId: p.id, name: p.name, from: p.from, Icon: p.Icon, side: "A" },
    { key: `${p.id}-b`, pairId: p.id, name: p.name, from: p.from, Icon: p.Icon, side: "B" },
  ]);
  return cards.sort(() => Math.random() - 0.5);
}

export default function Traditions() {
  const { traditionsBest, finishMini, toast } = useApp();
  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const totalPairs = traditionPairs.length;
  /* matched holds one pairId per solved pair, so compare against pair count, not card count */
  const won = matched.length > 0 && matched.length === totalPairs;

  useEffect(() => {
    if (!startedAt || won) return undefined;
    const id = setInterval(() => setElapsed(Math.round((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startedAt, won]);

  useEffect(() => {
    if (!won) return;
    finishMini({ key: "traditionsBest", score: matched.length });
    toast(`All pairs matched in ${moves} tries.`, { tone: "ok" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const flip = (card) => {
    if (busy || won) return;
    if (flipped.includes(card.key) || matched.includes(card.pairId)) return;
    const next = [...flipped, card.key];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((k) => deck.find((c) => c.key === k));
      setBusy(true);
      setTimeout(() => {
        if (a.pairId === b.pairId) {
          setMatched((m) => [...m, a.pairId]);
          toast(`${a.name} matched`, { tone: "ok", duration: 1800 });
        }
        setFlipped([]);
        setBusy(false);
      }, a.pairId === b.pairId ? 420 : 780);
    }
  };

  const restart = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setStartedAt(null);
    setElapsed(0);
  };

  const found = matched.length;
  const accuracy = moves ? Math.round((found / moves) * 100) : 0;

  const legend = useMemo(() => traditionPairs.slice(0, 6), []);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Discover Bharat · Memory game"
        title="INDIAN TRADITIONS"
        sub="Match each tradition to its twin. Sixteen cards, eight pairs — and a second board is always harder than the first."
        accent="var(--a-discover)"
        right={
          <div className="row wrap" style={{ gap: 8 }}>
            <DemoBadge label={traditionsBest ? `Best ${traditionsBest} pairs` : "Memory"} />
            <button className="btn btn-ghost btn-sm" onClick={restart}>
              <RotateCcw size={14} /> Shuffle
            </button>
          </div>
        }
      />

      <Link to="/play" className="btn btn-soft btn-sm" style={{ marginBottom: 18, textDecoration: "none" }}>
        <ArrowLeft size={15} /> Back to Play
      </Link>

      <div className="grid split">
        <section className="card card-pad">
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(126px,1fr))", gap: 12 }}>
            {deck.map((c) => {
              const isMatched = matched.includes(c.pairId);
              const isUp = flipped.includes(c.key) || isMatched;
              return (
                <button
                  key={c.key}
                  onClick={() => flip(c)}
                  className="card"
                  style={{
                    aspectRatio: "1 / 0.82",
                    padding: 12,
                    display: "grid",
                    placeItems: "center",
                    gap: 6,
                    cursor: isMatched ? "default" : "pointer",
                    borderColor: isMatched ? "rgba(67,217,192,0.5)" : isUp ? "rgba(255,209,102,0.45)" : "var(--stroke)",
                    background: isMatched
                      ? "rgba(67,217,192,0.1)"
                      : isUp
                        ? "rgba(255,209,102,0.09)"
                        : "var(--glass)",
                    transition: "transform .3s var(--ease), background .3s, border-color .3s",
                    transform: isUp ? "none" : "rotateY(0)",
                  }}
                >
                  {isUp ? (
                    <>
                      <c.Icon size={26} style={{ color: isMatched ? "var(--teal)" : "var(--marigold)" }} />
                      <span style={{ fontSize: "0.72rem", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{c.name}</span>
                      <span className="faint" style={{ fontSize: "0.62rem", textAlign: "center" }}>{c.from}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={22} style={{ color: "rgba(255,255,255,0.22)" }} />
                      <span className="faint" style={{ fontSize: "0.66rem" }}>Tap to reveal</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {!startedAt && !won && (
            <div className="row" style={{ justifyContent: "center", marginTop: 16 }}>
              <button className="btn btn-primary btn-sm" onClick={() => setStartedAt(Date.now())}>
                Start the timer
              </button>
            </div>
          )}
        </section>

        <div className="stack" style={{ "--gap": "16px" }}>
          <section className="card card-pad">
            <div className="row-between">
              <div>
                <div className="eyebrow" style={{ color: "var(--rose)" }}>
                  Progress
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 600, marginTop: 8 }}>
                  {found} of {traditionPairs.length} pairs
                </div>
              </div>
              <Ring
                value={(found / traditionPairs.length) * 100}
                size={70}
                stroke={7}
                from="var(--rose)"
                to="var(--marigold)"
              >
                <div className="mono" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                  {Math.round((found / traditionPairs.length) * 100)}%
                </div>
              </Ring>
            </div>

            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              <div className="stat" style={{ padding: "12px 14px" }}>
                <span className="k">Tries</span>
                <div className="v mono" style={{ fontSize: "1.2rem" }}>{moves}</div>
              </div>
              <div className="stat" style={{ padding: "12px 14px" }}>
                <span className="k">Time</span>
                <div className="v mono" style={{ fontSize: "1.2rem" }}>{elapsed}s</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="row-between" style={{ fontSize: "0.76rem", marginBottom: 7 }}>
                <span className="faint">First-try accuracy</span>
                <span className="mono">{accuracy}%</span>
              </div>
              <div className="bar bar-thin">
                <i style={{ width: `${Math.max(2, accuracy)}%`, "--b1": "var(--rose)", "--b2": "var(--marigold)" }} />
              </div>
            </div>

            {won && (
              <div
                style={{
                  marginTop: 16,
                  padding: "15px 17px",
                  borderRadius: 16,
                  background: "rgba(67,217,192,0.09)",
                  border: "1px solid rgba(67,217,192,0.28)",
                }}
              >
                <div className="row" style={{ gap: 9 }}>
                  <CircleCheck size={17} style={{ color: "var(--teal)" }} />
                  <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>All matched</span>
                </div>
                <p className="muted" style={{ fontSize: "0.84rem", marginTop: 8, lineHeight: 1.6 }}>
                  {moves <= 9
                    ? "Excellent recall — most people need more tries on a first run."
                    : "Done. Try the next board once more and see if your first-try accuracy improves."}
                </p>
                <div className="row wrap" style={{ gap: 10, marginTop: 14 }}>
                  <button className="btn btn-primary btn-sm" onClick={restart}>
                    <RotateCcw size={14} /> New board
                  </button>
                  <Link to="/progress" className="btn btn-ghost btn-sm" style={{ textDecoration: "none" }}>
                    My report <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </section>

          <section className="card card-pad">
            <div className="row" style={{ gap: 10 }}>
              <Flame size={16} style={{ color: "var(--saffron)" }} />
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>What you'll meet</span>
            </div>
            <div className="stack" style={{ "--gap": "9px", marginTop: 12 }}>
              {legend.map((p) => (
                <div key={p.id} className="row" style={{ gap: 10, fontSize: "0.83rem" }}>
                  <p.Icon size={14} style={{ color: "var(--marigold)", flex: "none" }} />
                  <span>{p.name}</span>
                  <span className="faint" style={{ marginLeft: "auto", fontSize: "0.72rem" }}>{p.from}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
