import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Blocks,
  BrainCircuit,
  Car,
  Hammer,
  Lock,
} from "lucide-react";
import { flowNodes, growthItems, hardwareCards } from "../lib/mockData";
import { DemoBadge, DemoNote, PageHeader } from "../components/ui";

const CARD_ICONS = { BrainCircuit, Car, Hammer };

export default function HowItWorks() {
  const [active, setActive] = useState("app");
  const node = flowNodes.find((n) => n.id === active) ?? flowNodes[0];

  return (
    <div className="page">
      <PageHeader
        eyebrow="The idea"
        title="How BharatPlay Works"
        sub="One app in the middle, optional smart hardware around it, and a plain-language report at the end. Tap any step to read what it does."
        accent="var(--indigo)"
        right={<DemoBadge label="Concept walkthrough" />}
      />

      <div className="grid split">
        {/* ---------------- FLOW ---------------- */}
        <section className="card card-pad">
          <div className="eyebrow" style={{ color: "var(--marigold)" }}>
            The flow
          </div>

          <div style={{ position: "relative", marginTop: 20, paddingLeft: 6 }}>
            <svg
              viewBox="0 0 10 620"
              preserveAspectRatio="none"
              style={{ position: "absolute", left: 27, top: 8, width: 3, height: "calc(100% - 16px)" }}
              aria-hidden="true"
            >
              <line x1="1.5" y1="0" x2="1.5" y2="620" stroke="rgba(255,255,255,0.1)" strokeWidth="1.4" />
              <line x1="1.5" y1="0" x2="1.5" y2="620" stroke="url(#flow-grad)" strokeWidth="1.8" strokeDasharray="10 16">
                <animate attributeName="stroke-dashoffset" from="26" to="0" dur="1.5s" repeatCount="indefinite" />
              </line>
              <defs>
                <linearGradient id="flow-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffd166" />
                  <stop offset="0.5" stopColor="#ff8fb1" />
                  <stop offset="1" stopColor="#43d9c0" />
                </linearGradient>
              </defs>
            </svg>

            <div style={{ display: "grid", gap: 6 }}>
              {flowNodes.map((n) => {
                const on = active === n.id;
                const Icon = n.Icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => setActive(n.id)}
                    className="row"
                    style={{
                      gap: 14,
                      padding: "12px 14px",
                      borderRadius: 15,
                      textAlign: "left",
                      border: `1px solid ${on ? "rgba(255,255,255,0.2)" : "transparent"}`,
                      background: on ? "rgba(255,255,255,0.055)" : "transparent",
                      transition: "background .25s var(--ease), border-color .25s var(--ease)",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        display: "grid",
                        placeItems: "center",
                        flex: "none",
                        background: on ? "linear-gradient(140deg, rgba(255,209,102,0.22), rgba(255,159,69,0.08))" : "var(--glass)",
                        border: `1px solid ${on ? "rgba(255,180,110,0.4)" : "var(--stroke)"}`,
                        color: on ? "var(--marigold)" : "var(--text-faint)",
                        transition: "all .3s var(--ease)",
                      }}
                    >
                      <Icon size={19} />
                    </span>
                    <span className="grow" style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: "0.92rem", fontWeight: 600 }}>{n.label}</span>
                      <span className="faint" style={{ fontSize: "0.76rem" }}>
                        {n.sub}
                      </span>
                    </span>
                    <ArrowRight
                      size={15}
                      style={{ color: on ? "var(--marigold)" : "var(--text-faint)", transition: "transform .3s var(--ease)" }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------- EXPLANATION ---------------- */}
        <div className="stack" style={{ "--gap": "16px" }}>
          <section
            className="card card-pad motif-top"
            style={{ borderColor: "rgba(255,180,110,0.28)", animation: "rise .4s var(--ease) both" }}
            key={node.id}
          >
            <div className="row" style={{ gap: 12 }}>
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 15,
                  display: "grid",
                  placeItems: "center",
                  background: "linear-gradient(140deg, rgba(255,209,102,0.2), rgba(255,159,69,0.06))",
                  border: "1px solid rgba(255,180,110,0.34)",
                  flex: "none",
                }}
              >
                <node.Icon size={22} style={{ color: "var(--marigold)" }} />
              </span>
              <div>
                <div className="eyebrow" style={{ color: "var(--saffron)" }}>
                  {node.sub}
                </div>
                <h3 style={{ fontSize: "1.2rem", marginTop: 7 }}>{node.title}</h3>
              </div>
            </div>
            <p className="muted" style={{ fontSize: "0.92rem", marginTop: 14, lineHeight: 1.66 }}>{node.text}</p>

            <div className="row wrap" style={{ gap: 10, marginTop: 20 }}>
              <span className="pill pill-accent">
                <Blocks size={12} /> Step {flowNodes.findIndex((n) => n.id === node.id) + 1} of {flowNodes.length}
              </span>
              {node.id === "hardware" && (
                <Link to="/focus/drive" className="btn btn-soft btn-sm" style={{ textDecoration: "none" }}>
                  Try Focus Drive <ArrowRight size={14} />
                </Link>
              )}
              {node.id === "esp" && (
                <Link to="/create" className="btn btn-soft btn-sm" style={{ textDecoration: "none" }}>
                  Open Create mode <ArrowRight size={14} />
                </Link>
              )}
              {node.id === "report" && (
                <Link to="/progress" className="btn btn-soft btn-sm" style={{ textDecoration: "none" }}>
                  Open the report <ArrowRight size={14} />
                </Link>
              )}
              {node.id === "user" && (
                <Link to="/play" className="btn btn-soft btn-sm" style={{ textDecoration: "none" }}>
                  Start playing <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </section>

          <section className="card card-pad">
            <div className="row" style={{ gap: 10 }}>
              <Cpu size={17} style={{ color: "var(--teal)" }} />
              <span style={{ fontWeight: 600, fontSize: "0.94rem" }}>The optional hardware</span>
            </div>
            <div className="stack" style={{ "--gap": "12px", marginTop: 14 }}>
              {hardwareCards.map((h) => {
                const Icon = CARD_ICONS[h.Icon] ?? h.Icon;
                return (
                  <div
                    key={h.title}
                    style={{ padding: "14px 16px", borderRadius: 15, background: "var(--glass)", border: "1px solid var(--stroke)" }}
                  >
                    <div className="row" style={{ gap: 10 }}>
                      <Icon size={17} style={{ color: "var(--sky)" }} />
                      <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{h.title}</span>
                      <span className="pill pill-demo" style={{ marginLeft: "auto" }}>Optional</span>
                    </div>
                    <ul style={{ marginTop: 10, display: "grid", gap: 6 }}>
                      {h.points.map((p) => (
                        <li key={p} className="row" style={{ gap: 8, alignItems: "flex-start", fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: 1.5 }}>
                          <span className="dot dot-live" style={{ marginTop: 6 }} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14 }}>
              <DemoNote Icon={Sparkles}>
                None of this hardware is required, and none of it is connected in this build. Every screen works on its
                own with sample data.
              </DemoNote>
            </div>
          </section>
        </div>
      </div>

      {/* ---------------- GROWTH ---------------- */}
      <div className="section-gap">
        <div className="row-between wrap" style={{ gap: 12, marginBottom: 16 }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--rose)" }}>
              Where this goes next
            </div>
            <h2 style={{ fontSize: "1.24rem", marginTop: 8 }}>How the platform grows</h2>
          </div>
          <span className="pill">Add content, not new code</span>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(228px,1fr))", gap: 14 }}>
          {growthItems.map((g) => (
            <div key={g.title} className="metric">
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,143,177,0.13)",
                  border: "1px solid rgba(255,143,177,0.26)",
                }}
              >
                <g.Icon size={17} style={{ color: "var(--rose)" }} />
              </span>
              <div style={{ fontSize: "0.94rem", fontWeight: 600, marginTop: 14 }}>{g.title}</div>
              <p className="muted" style={{ fontSize: "0.82rem", marginTop: 6, lineHeight: 1.55 }}>
                {g.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-gap card card-pad row wrap" style={{ gap: 16 }}>
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            background: "rgba(67,217,192,0.12)",
            border: "1px solid rgba(67,217,192,0.28)",
            flex: "none",
          }}
        >
          <ShieldCheck size={19} style={{ color: "var(--teal)" }} />
        </span>
        <div className="grow" style={{ minWidth: 240 }}>
          <div style={{ fontWeight: 600, fontSize: "0.94rem" }}>What happens to your data</div>
          <p className="muted" style={{ fontSize: "0.85rem", marginTop: 5, lineHeight: 1.58 }}>
            Short version: scores only, stored in your own browser, and nothing leaves the device. The full list is on the
            privacy page.
          </p>
        </div>
        <Link to="/privacy" className="btn btn-soft btn-sm" style={{ textDecoration: "none" }}>
          <Lock size={14} /> Read the privacy page
        </Link>
      </div>
    </div>
  );
}
