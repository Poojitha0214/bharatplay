import { useId } from "react";
import { Info, CircleCheck, TriangleAlert, Sparkles, Wifi } from "lucide-react";
import { useApp } from "../lib/store";

const ICONS = { info: Info, ok: CircleCheck, warn: TriangleAlert, ai: Sparkles, live: Wifi };

const TONES = {
  info: { bg: "rgba(147,166,255,0.14)", fg: "#b9c5ff" },
  ok: { bg: "rgba(67,217,192,0.16)", fg: "var(--teal)" },
  warn: { bg: "rgba(255,159,69,0.16)", fg: "var(--saffron)" },
  ai: { bg: "rgba(255,209,102,0.16)", fg: "var(--marigold)" },
  live: { bg: "rgba(108,198,255,0.16)", fg: "var(--sky)" },
};

export default function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => {
        const tone = TONES[t.tone] ?? TONES.info;
        const Ico = ICONS[t.tone] ?? ICONS.info;
        return (
          <div key={t.id} className={`toast ${t.leaving ? "out" : ""}`}>
            <span className="toast-ico" style={{ background: tone.bg, color: tone.fg }}>
              {t.icon ? <span style={{ fontSize: 15 }}>{t.icon}</span> : <Ico size={16} />}
            </span>
            <div style={{ fontSize: "0.85rem", lineHeight: 1.45, paddingTop: 2 }}>{t.message}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function DemoBadge({ label = "Simulated", tone = "demo", title }) {
  return (
    <span className={`pill pill-${tone}`} title={title || "This reading is generated inside your browser for the demo. No device is connected."}>
      {label}
    </span>
  );
}

export function DemoNote({ children, Icon = Info }) {
  return (
    <div
      className="row"
      style={{
        gap: 9,
        padding: "10px 13px",
        borderRadius: 14,
        background: "rgba(147,166,255,0.08)",
        border: "1px dashed rgba(147,166,255,0.3)",
        fontSize: "0.76rem",
        color: "#c3ccff",
        lineHeight: 1.5,
        alignItems: "flex-start",
      }}
    >
      <Icon size={15} style={{ flex: "none", marginTop: 1 }} />
      <span>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function Bar({ value, from, to, className = "" }) {
  return (
    <div className={`bar ${className}`}>
      <i style={{ width: `${Math.max(2, value)}%`, "--b1": from, "--b2": to }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function Ring({ value, size = 92, stroke = 8, from = "var(--saffron)", to = "var(--marigold)", children, trackOpacity = 0.09 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const gradId = `ring-${useId().replace(/:/g, "")}`;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.9)" strokeOpacity={trackOpacity} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (Math.max(0, Math.min(100, value)) / 100) * c}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function SectionTitle({ eyebrow, title, sub, right, accent }) {
  return (
    <div className="row-between wrap" style={{ alignItems: "flex-end", marginBottom: 16, gap: 14 }}>
      <div>
        {eyebrow && (
          <div className="eyebrow" style={{ color: accent }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{ fontSize: "1.22rem", marginTop: eyebrow ? 8 : 0 }}>{title}</h2>
        {sub && <p className="muted" style={{ fontSize: "0.87rem", marginTop: 6, maxWidth: "58ch" }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function PageHeader({ eyebrow, title, sub, right, accent }) {
  return (
    <div className="row-between wrap" style={{ alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
      <div style={{ minWidth: 0 }}>
        {eyebrow && (
          <div className="row" style={{ gap: 8 }}>
            <span className="eyebrow" style={{ color: accent }}>
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="page-title" style={{ marginTop: eyebrow ? 10 : 0 }}>
          {title}
        </h1>
        {sub && (
          <p className="lede" style={{ marginTop: 8 }}>
            {sub}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}
