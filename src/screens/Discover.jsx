import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Quote, Blocks, ArrowLeft } from "lucide-react";
import { timeline } from "../lib/mockData";
import { DemoBadge, PageHeader } from "../components/ui";

export default function Discover() {
  const [i, setI] = useState(2);
  const railRef = useRef(null);
  const item = timeline[i];
  const next = () => setI((v) => (v + 1) % timeline.length);
  const prev = () => setI((v) => (v - 1 + timeline.length) % timeline.length);

  /* the rail scrolls sideways on narrow screens — keep the selected era in view */
  useEffect(() => {
    const el = railRef.current?.querySelectorAll("button")[i];
    if (el && typeof el.scrollIntoView === "function") el.scrollIntoView({ block: "nearest", inline: "center" });
  }, [i]);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Discover India"
        title="STORIES, HISTORY & CIVILIZATION"
        sub="Five thousand years of settlements, kingdoms, art and invention — the backdrop the games are built on."
        accent="var(--a-discover)"
        right={<DemoBadge label="Reference content" />}
      />

      <div className="grid split">
        {/* ---------------- TIMELINE ---------------- */}
        <section className="card card-pad">
          <div className="row-between wrap" style={{ gap: 12, marginBottom: 18 }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rose)" }}>
                Time travel
              </div>
              <h3 style={{ fontSize: "1.16rem", marginTop: 8 }}>
                {item.era} · {item.name}
              </h3>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="icon-btn" onClick={prev} aria-label="Earlier">
                <ChevronLeft size={17} />
              </button>
              <button className="icon-btn" onClick={next} aria-label="Later">
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              padding: "22px 22px 24px",
              borderRadius: "var(--r-lg)",
              background: "radial-gradient(120% 120% at 20% 0%, rgba(255,143,177,0.13), rgba(255,255,255,0.015))",
              border: "1px solid var(--stroke)",
              animation: "rise .45s var(--ease) both",
              minHeight: 236,
            }}
            key={i}
          >
            <div className="row wrap" style={{ gap: 10 }}>
              <span
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 17,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,143,177,0.14)",
                  border: "1px solid rgba(255,143,177,0.3)",
                }}
              >
                <item.Icon size={24} style={{ color: "var(--rose)" }} />
              </span>
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{item.name}</div>
                <div className="row" style={{ gap: 7, marginTop: 5, fontSize: "0.8rem", color: "var(--text-dim)" }}>
                  <MapPin size={13} style={{ color: "var(--rose)" }} />
                  {item.region}
                </div>
              </div>
            </div>

            <p className="lede" style={{ marginTop: 16, fontSize: "0.93rem" }}>{item.text}</p>
          </div>

          {/* rail */}
          <div style={{ position: "relative", marginTop: 22, paddingTop: 6 }}>
            <div
              ref={railRef}
              style={{
                overflowX: "auto",
                overflowY: "hidden",
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div style={{ position: "relative", minWidth: timeline.length * 76, padding: "0 12px" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    right: 12,
                    top: 15,
                    height: 1,
                    background: "rgba(255,255,255,0.1)",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                  {timeline.map((t, idx) => (
                    <button
                      key={t.era}
                      onClick={() => setI(idx)}
                      aria-label={t.name}
                      style={{ display: "grid", justifyItems: "center", gap: 8, flex: "1 0 76px", minWidth: 0 }}
                    >
                      <span
                        style={{
                          width: idx === i ? 13 : 9,
                          height: idx === i ? 13 : 9,
                          borderRadius: 99,
                          background: idx === i ? "var(--rose)" : "rgba(255,255,255,0.18)",
                          border: idx <= i ? "1px solid rgba(255,143,177,0.5)" : "1px solid transparent",
                          transition: "all .35s var(--ease)",
                          boxShadow: idx === i ? "0 0 0 5px rgba(255,143,177,0.14)" : "none",
                        }}
                      />
                      <span
                        className="faint"
                        style={{
                          fontSize: "0.6rem",
                          color: idx === i ? "var(--rose)" : undefined,
                          whiteSpace: "nowrap",
                          maxWidth: "100%",
                        }}
                      >
                        {t.era}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- SIDEBAR ---------------- */}
        <div className="stack" style={{ "--gap": "16px" }}>
          <section className="card card-pad">
            <div className="row" style={{ gap: 10 }}>
              <Quote size={17} style={{ color: "var(--marigold)" }} />
              <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>Why games for this?</span>
            </div>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: 10, lineHeight: 1.62 }}>
              History is easy to forget and hard to enjoy as a wall of dates. In BharatPlay it arrives as a problem to
              solve: a chariot to steer, a maze to cross, a memory to hold. The date stays because the game needed it.
            </p>
          </section>

          <section className="card card-pad">
            <div className="eyebrow" style={{ color: "var(--marigold)" }}>
              Jump into a game
            </div>
            <div className="stack" style={{ "--gap": "10px", marginTop: 14 }}>
              {[
                { to: "/play/chakravyuha", title: "Chakravyuha", desc: "Five rings, five kinds of thinking" },
                { to: "/play/mahabharata", title: "Mahabharata", desc: "Three decisions before dawn" },
                { to: "/play/traditions", title: "Indian Traditions", desc: "Match the tradition to its home" },
              ].map((g) => (
                <Link
                  key={g.to}
                  to={g.to}
                  className="row"
                  style={{
                    gap: 12,
                    padding: "13px 14px",
                    borderRadius: 14,
                    border: "1px solid var(--stroke)",
                    background: "var(--glass)",
                    color: "inherit",
                    textDecoration: "none",
                    transition: "transform .25s var(--ease), border-color .25s",
                  }}
                >
                  <Blocks size={16} style={{ color: "var(--marigold)", flex: "none" }} />
                  <span className="grow" style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: "0.88rem", fontWeight: 600 }}>{g.title}</span>
                    <span className="faint" style={{ fontSize: "0.74rem" }}>
                      {g.desc}
                    </span>
                  </span>
                  <ArrowRight size={15} style={{ color: "var(--text-faint)" }} />
                </Link>
              ))}
            </div>
          </section>

          <Link to="/play" className="btn btn-ghost btn-block" style={{ textDecoration: "none" }}>
            <ArrowLeft size={15} /> All games & crafts
          </Link>
        </div>
      </div>
    </div>
  );
}
