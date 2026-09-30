import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Flame,
  Clock,
  Trophy,
  Sparkles,
  ChartLine,
  Orbit,
  BrainCircuit,
  ChevronRight,
} from "lucide-react";
import { dashboardCards, chakraLayers } from "../lib/mockData";
import { useApp, useSmoothNumber } from "../lib/store";
import { Bar, DemoBadge, SectionTitle } from "../components/ui";

function ProgressRow({ label, value, from, to, Icon }) {
  const shown = useSmoothNumber(value, { duration: 1100 });
  return (
    <div>
      <div className="row-between" style={{ marginBottom: 8 }}>
        <span className="row" style={{ gap: 9, fontSize: "0.88rem", fontWeight: 500 }}>
          {Icon && <Icon size={15} style={{ color: from }} />}
          {label}
        </span>
        <span className="mono" style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>
          {shown}%
        </span>
      </div>
      <Bar value={value} from={from} to={to} className="bar-tall" />
    </div>
  );
}

export default function Dashboard() {
  const app = useApp();
  const navigate = useNavigate();

  const resumeLayer = Math.min(5, app.chakraUnlocked);
  const done = Object.values(app.craftsCompleted).reduce((a, b) => a + b, 0);

  return (
    <div className="page">
      {/* Greeting */}
      <div className="row-between wrap" style={{ alignItems: "flex-end", gap: 18, marginBottom: 26 }}>
        <div>
          <div className="eyebrow" style={{ color: "var(--marigold)" }}>
            {greeting()} · Day {app.streak} of your streak
          </div>
          <h1 className="page-title" style={{ fontSize: "clamp(1.7rem,1.2rem+2.2vw,2.5rem)", marginTop: 12 }}>
            Namaste, Explorer! <span aria-hidden>👋</span>
          </h1>
          <p className="lede" style={{ marginTop: 8 }}>
            What would you like to explore today?
          </p>
        </div>

        <div className="row wrap" style={{ gap: 10 }}>
          <span className="stat" style={{ padding: "11px 15px" }}>
            <span className="row" style={{ gap: 7 }}>
              <Flame size={14} style={{ color: "var(--saffron)" }} />
              <span className="k">Streak</span>
            </span>
            <span className="v" style={{ fontSize: "1.15rem" }}>
              {app.streak} days
            </span>
          </span>
          <span className="stat" style={{ padding: "11px 15px" }}>
            <span className="row" style={{ gap: 7 }}>
              <Clock size={14} style={{ color: "var(--teal)" }} />
              <span className="k">Time this week</span>
            </span>
            <span className="v" style={{ fontSize: "1.15rem" }}>
              {app.minutes} min
            </span>
          </span>
        </div>
      </div>

      {/* Four main cards */}
      <div className="grid stagger" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(238px, 1fr))", gap: 16 }}>
        {dashboardCards.map((c) => (
          <button
            key={c.id}
            className="card card-pad hover-lift tint-card"
            style={{ textAlign: "left", "--tint": c.tint }}
            onClick={() => navigate(c.to.replace("#", ""))}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
            }}
          >
            <span className="sheen" />
            <div
              className="row"
              style={{
                gap: 11,
                width: 44,
                height: 44,
                borderRadius: 14,
                justifyContent: "center",
                background: `linear-gradient(140deg, ${c.tint}, rgba(255,255,255,0.02))`,
                border: `1px solid ${c.accent}44`,
                color: c.accent,
              }}
            >
              <c.Icon size={21} />
            </div>

            <div className="eyebrow" style={{ marginTop: 18, color: c.accent }}>
              {c.kicker}
            </div>
            <div style={{ fontSize: "1.14rem", fontWeight: 600, marginTop: 7, letterSpacing: "-0.015em" }}>{c.title}</div>
            <p className="muted" style={{ fontSize: "0.83rem", marginTop: 8, lineHeight: 1.55 }}>
              {c.body}
            </p>

            <div className="row" style={{ gap: 7, marginTop: 16, color: c.accent, fontSize: "0.8rem", fontWeight: 600 }}>
              Open
              <ArrowRight size={15} style={{ transition: "transform .3s var(--ease)" }} />
            </div>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="grid section-gap split">
        <section className="card card-pad motif-top">
          <SectionTitle
            eyebrow="Sample data"
            title="Your progress"
            sub="These numbers are sample values for the demo. They update when you finish an activity."
            right={<DemoBadge />}
          />
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 20, marginTop: 20 }}>
            {app.skillRows.map((s) => (
              <ProgressRow key={s.key} label={s.label} value={s.value} from={s.from} to={s.to} />
            ))}
          </div>
        </section>

        <div className="stack" style={{ "--gap": "16px" }}>
          <section className="card card-pad">
            <SectionTitle eyebrow="Pick up where you left off" title="Continue" />
            <Link to="/play/chakravyuha" className="list-item" style={{ color: "inherit", textDecoration: "none" }}>
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(147,166,255,0.13)",
                  border: "1px solid rgba(147,166,255,0.28)",
                  flex: "none",
                }}
              >
                <Orbit size={18} style={{ color: "var(--a-focus)" }} />
              </span>
              <span className="grow" style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 500 }}>
                  Chakravyuha · Layer {resumeLayer}
                </span>
                <span className="faint" style={{ fontSize: "0.74rem" }}>
                  {chakraLayers[resumeLayer - 1]?.name} challenge
                </span>
              </span>
              <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
            </Link>

            <Link to="/create" className="list-item" style={{ color: "inherit", textDecoration: "none" }}>
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,159,69,0.13)",
                  border: "1px solid rgba(255,159,69,0.28)",
                  flex: "none",
                }}
              >
                <Sparkles size={18} style={{ color: "var(--a-create)" }} />
              </span>
              <span className="grow" style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 500 }}>
                  Shape a {done ? "new" : "first"} pot
                </span>
                <span className="faint" style={{ fontSize: "0.74rem" }}>
                  Create mode · guided trace
                </span>
              </span>
              <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
            </Link>
          </section>

          <section className="card card-pad">
            <SectionTitle eyebrow="Today" title="Suggested session" />
            <div className="stack" style={{ "--gap": "9px" }}>
              {[
                { Icon: BrainCircuit, t: "Focus drill · 30 sec", done: app.focusBest > 0 },
                { Icon: Orbit, t: "Chakravyuha · 1 layer", done: app.chakraSolved > 0 },
                { Icon: ChartLine, t: "See your report", done: false },
              ].map(({ Icon, t, done: d }) => (
                <div key={t} className="row" style={{ gap: 10, fontSize: "0.86rem" }}>
                  <Icon size={15} style={{ color: d ? "var(--teal)" : "var(--text-faint)" }} />
                  <span className={d ? "faint" : ""} style={d ? { textDecoration: "line-through" } : undefined}>
                    {t}
                  </span>
                  {d && <span className="pill pill-live" style={{ marginLeft: "auto", padding: "2px 9px" }}>Done</span>}
                </div>
              ))}
            </div>
            <Link to="/progress" className="btn btn-soft btn-block btn-sm" style={{ marginTop: 16, textDecoration: "none" }}>
              <Trophy size={14} /> Open my report
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
