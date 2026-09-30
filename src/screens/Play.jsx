import { useNavigate } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import { cultureModules } from "../lib/mockData";
import { useApp } from "../lib/store";
import { DemoBadge, PageHeader } from "../components/ui";

export default function Play() {
  const navigate = useNavigate();
  const app = useApp();

  const go = (kind, id) => {
    if (kind === "chakravyuha") navigate("/play/chakravyuha");
    else if (kind === "decision") navigate("/play/mahabharata");
    else if (kind === "memory") navigate("/play/traditions");
    else navigate(`/create?craft=${id}`);
  };

  const badge = (id) => {
    if (id === "chakravyuha" && app.chakraSolved > 0) return `Layer ${Math.min(5, app.chakraSolved + 1)} next`;
    if (id === "mahabharata" && app.mahabharataBest > 0) return `${app.mahabharataBest}/3 decided well`;
    if (id === "traditions" && app.traditionsBest > 0) return `Best ${app.traditionsBest} pairs`;
    if (id === "pottery" && app.craftsCompleted.pottery > 0) return `${app.craftsCompleted.pottery} finished`;
    if (id === "carving" && app.craftsCompleted.carving > 0) return `${app.craftsCompleted.carving} finished`;
    return null;
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Play"
        title="DISCOVER BHARAT"
        sub="Indian stories turned into thinking games. Pick a world, answer from inside it, and unlock the next layer."
        accent="var(--a-play)"
        right={<DemoBadge label="Sample scores" />}
      />

      <div className="grid stagger" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(272px,1fr))", gap: 16 }}>
        {cultureModules.map((m) => {
          const done = badge(m.id);
          return (
            <button
              key={m.id}
              className="card hover-lift tint-card"
              style={{ textAlign: "left", padding: 22, "--tint": m.tint }}
              onClick={() => go(m.kind, m.id)}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              <span className="sheen" />
              <div className="row-between">
                <span
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 15,
                    display: "grid",
                    placeItems: "center",
                    background: `linear-gradient(140deg, ${m.tint}, rgba(255,255,255,0.02))`,
                    border: `1px solid ${m.accent}44`,
                    color: m.accent,
                  }}
                >
                  <m.Icon size={22} />
                </span>
                <span className="eyebrow" style={{ color: m.accent }}>
                  {m.kicker}
                </span>
              </div>

              <h3 style={{ fontSize: "1.18rem", marginTop: 18 }}>{m.title}</h3>
              <div style={{ color: m.accent, fontSize: "0.88rem", fontWeight: 500, marginTop: 6 }}>{m.tagline}</div>
              <p className="muted" style={{ fontSize: "0.84rem", marginTop: 10, lineHeight: 1.58 }}>
                {m.body}
              </p>

              <div className="row wrap" style={{ gap: 7, marginTop: 16 }}>
                {m.meta.map((t) => (
                  <span key={t} className="pill" style={{ fontSize: "0.68rem" }}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="row-between" style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--stroke)" }}>
                <span className="row" style={{ gap: 7, color: m.accent, fontSize: "0.83rem", fontWeight: 600 }}>
                  {done ?? "Start"}
                  <ArrowRight size={15} />
                </span>
                {done && (
                  <span className="row" style={{ gap: 6, fontSize: "0.7rem", color: "var(--teal)" }}>
                    <Info size={12} /> in progress
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="section-gap card card-pad">
        <div className="row wrap" style={{ gap: 16 }}>
          <div className="grow" style={{ minWidth: 240 }}>
            <div className="eyebrow" style={{ color: "var(--teal)" }}>
              How the games work
            </div>
            <p className="muted" style={{ fontSize: "0.88rem", marginTop: 8, lineHeight: 1.6, maxWidth: "68ch" }}>
              Each card puts you inside a story and asks you to think, not memorise. Every answer is explained in plain
              words, and the skill you just used — memory, patterns, decisions, strategy, problem solving — is recorded so
              your report can show where you are improving.
            </p>
          </div>
          <div className="row wrap" style={{ gap: 8 }}>
            {["Memory", "Patterns", "Decisions", "Strategy", "Problem solving"].map((s) => (
              <span key={s} className="pill pill-accent">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
