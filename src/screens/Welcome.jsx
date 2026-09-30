import { useEffect, useState } from "react";
import { ArrowRight, Loader, MousePointerClick, Sparkles, Compass, CircuitBoard } from "lucide-react";
import { heroIcons } from "../lib/mockData";
import Rangoli from "../components/Rangoli";

const ROLES = [
  {
    title: "Learn",
    text: "Stories, history and traditional knowledge from every corner of the country.",
    Icon: Compass,
  },
  {
    title: "Play",
    text: "Memory, pattern and strategy games built on Indian themes.",
    Icon: MousePointerClick,
  },
  {
    title: "Create",
    text: "Shape a pot, carve a motif — skills you can feel in your hands.",
    Icon: Sparkles,
  },
  {
    title: "Grow",
    text: "Every session ends with a plain-language next step.",
    Icon: CircuitBoard,
  },
];

export default function Welcome({ onStart, onExplore }) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBusy(false), 2400);
    return () => clearTimeout(t);
  }, [busy]);

  const start = () => {
    if (busy) return;
    setBusy(true);
    setTimeout(onStart, 1500);
  };

  return (
    <div className="page" style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column" }}>
      <div className="aurora">
        <span />
        <span />
        <span />
      </div>
      <Rangoli size={900} opacity={0.1} className="bp-rangoli" />
      <div className="vignette" />

      <header className="row-between" style={{ position: "relative", zIndex: 2, padding: "clamp(18px,3vw,30px) clamp(18px,4vw,48px)" }}>
        <div className="row" style={{ gap: 11 }}>
          <span className="brand-mark">
            <Sparkles size={19} style={{ color: "var(--marigold)" }} />
          </span>
          <div>
            <div className="brand-name" style={{ letterSpacing: "0.08em" }}>
              BHARATPLAY
            </div>
            <div className="brand-sub">Interactive prototype</div>
          </div>
        </div>
        <span className="pill-demo">Prototype build</span>
      </header>

      <main
        className="grow"
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          placeItems: "center",
          padding: "24px clamp(18px,4vw,48px) 40px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 860 }}>
          <div className="eyebrow" style={{ justifyContent: "center", color: "var(--marigold)" }}>
            Culture · Focus · Craft
          </div>

          <h1
            className="display"
            style={{
              fontSize: "clamp(2.9rem, 1.4rem + 8.4vw, 6.6rem)",
              lineHeight: 0.96,
              margin: "18px 0 0",
              letterSpacing: "-0.045em",
            }}
          >
            <span
              style={{
                background: "linear-gradient(120deg,#fff 20%,#ffd9a8 46%,#ff9f45 78%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              BHARAT
            </span>
            <span style={{ color: "var(--marigold)" }}>PLAY</span>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.05rem, 0.8rem + 1.1vw, 1.6rem)",
              marginTop: 14,
              letterSpacing: "0.01em",
              color: "var(--text)",
            }}
          >
            Learn. Play. Create. Grow.
          </p>

          <p className="lede" style={{ margin: "16px auto 0", maxWidth: "54ch", fontSize: "clamp(0.92rem,0.85rem+0.3vw,1.05rem)" }}>
            India's culture and traditional knowledge, reimagined through interactive play.
          </p>

          <div className="row wrap" style={{ justifyContent: "center", gap: 10, marginTop: 22 }}>
            {heroIcons.map(({ label, Icon }) => (
              <span key={label} className="pill" style={{ padding: "7px 14px" }}>
                <Icon size={14} style={{ color: "var(--saffron)" }} />
                {label}
              </span>
            ))}
          </div>

          <div className="row wrap" style={{ justifyContent: "center", gap: 12, marginTop: 34 }}>
            <button className="btn btn-primary btn-lg" onClick={start} disabled={busy}>
              {busy ? (
                <>
                  <Loader size={17} className="spin" /> Preparing your playground…
                </>
              ) : (
                <>
                  Start Playing <ArrowRight size={17} />
                </>
              )}
            </button>
            <button className="btn btn-ghost btn-lg" onClick={onExplore} disabled={busy}>
              Explore BharatPlay
            </button>
          </div>

          {busy && (
            <div className="row" style={{ justifyContent: "center", gap: 8, marginTop: 16, color: "var(--text-faint)", fontSize: "0.78rem" }}>
              <span className="typing">
                <span />
                <span />
                <span />
              </span>
              Loading sample progress for this demo
            </div>
          )}

          <div
            className="grid stagger"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 12,
              marginTop: 52,
              textAlign: "left",
            }}
          >
            {ROLES.map(({ title, text, Icon }) => (
              <div key={title} className="card card-pad" style={{ padding: "18px 20px" }}>
                <div className="row" style={{ gap: 10 }}>
                  <Icon size={17} style={{ color: "var(--marigold)" }} />
                  <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{title}</span>
                </div>
                <p className="muted" style={{ fontSize: "0.82rem", marginTop: 8, lineHeight: 1.55 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer
        className="row-between wrap"
        style={{
          position: "relative",
          zIndex: 2,
          gap: 12,
          padding: "16px clamp(18px,4vw,48px) 22px",
          borderTop: "1px solid var(--stroke)",
          fontSize: "0.74rem",
          color: "var(--text-faint)",
        }}
      >
        <span>Built for a hackathon demo — every EEG, sensor and AI value on the following screens is simulated in your browser.</span>
        <span>No account, no sign-up, no backend.</span>
      </footer>
    </div>
  );
}
