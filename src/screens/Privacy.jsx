import { Link } from "react-router-dom";
import { ShieldCheck, Lock, EyeOff, Clock, Database, RotateCcw, ArrowRight, CircleCheck, TriangleAlert } from "lucide-react";
import { privacyPoints } from "../lib/mockData";
import { useApp } from "../lib/store";
import { DemoBadge, DemoNote, PageHeader } from "../components/ui";

const ICONS = [Lock, Database, Clock, EyeOff];

const NOT_CLAIMING = [
  "This build has no certifications or audit reports — there is nothing to certify yet.",
  "There is no user database, login, or server in this prototype.",
  "EEG readings here are produced by a small generator in the page, not by a headset.",
  "No data leaves your browser. Scores stay in local storage until you clear them.",
];

export default function Privacy() {
  const { reset, toast } = useApp();

  return (
    <div className="page">
      <PageHeader
        eyebrow="Privacy & data"
        title="PRIVACY, PLAINLY"
        sub="Only necessary learning and gameplay data is used for progress tracking. Here is exactly what that means in this prototype."
        accent="var(--teal)"
        right={<DemoBadge label="No account · local only" />}
      />

      <div className="grid split">
        <div className="stack" style={{ "--gap": "16px" }}>
          <section className="card card-pad motif-top" style={{ borderColor: "rgba(67,217,192,0.26)" }}>
            <div className="row" style={{ gap: 12 }}>
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 15,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(67,217,192,0.13)",
                  border: "1px solid rgba(67,217,192,0.3)",
                  flex: "none",
                }}
              >
                <ShieldCheck size={21} style={{ color: "var(--teal)" }} />
              </span>
              <div>
                <div className="eyebrow" style={{ color: "var(--teal)" }}>
                  Secure data
                </div>
                <div style={{ fontSize: "1.06rem", fontWeight: 600, marginTop: 8, lineHeight: 1.4 }}>
                  Only necessary learning and gameplay data is used for progress tracking.
                </div>
              </div>
            </div>
          </section>

          <section className="card card-pad">
            <div className="eyebrow" style={{ color: "var(--marigold)" }}>
              The four promises
            </div>
            <div className="stack" style={{ "--gap": "12px", marginTop: 16 }}>
              {privacyPoints.map((p, i) => {
                const Icon = ICONS[i] ?? Lock;
                return (
                  <div
                    key={p.title}
                    style={{
                      display: "flex",
                      gap: 14,
                      padding: "16px 18px",
                      borderRadius: 16,
                      background: "var(--glass)",
                      border: "1px solid var(--stroke)",
                    }}
                  >
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(67,217,192,0.12)",
                        border: "1px solid rgba(67,217,192,0.26)",
                        flex: "none",
                      }}
                    >
                      <Icon size={17} style={{ color: "var(--teal)" }} />
                    </span>
                    <div>
                      <div className="row" style={{ gap: 8 }}>
                        <CircleCheck size={15} style={{ color: "var(--teal)", flex: "none" }} />
                        <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>{p.title}</span>
                      </div>
                      <p className="muted" style={{ fontSize: "0.84rem", marginTop: 7, lineHeight: 1.6 }}>
                        {p.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card card-pad">
            <div className="row" style={{ gap: 10 }}>
              <TriangleAlert size={17} style={{ color: "var(--saffron)" }} />
              <span style={{ fontWeight: 600, fontSize: "0.94rem" }}>What this prototype does not claim</span>
            </div>
            <ul style={{ marginTop: 14, display: "grid", gap: 10 }}>
              {NOT_CLAIMING.map((t) => (
                <li key={t} className="row" style={{ gap: 10, alignItems: "flex-start", fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: 1.55 }}>
                  <span className="dot dot-warn" style={{ marginTop: 7 }} />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="stack" style={{ "--gap": "16px" }}>
          <section className="card card-pad">
            <div className="eyebrow" style={{ color: "var(--indigo)" }}>
              Your controls
            </div>
            <p className="muted" style={{ fontSize: "0.86rem", marginTop: 10, lineHeight: 1.6 }}>
              Progress is stored in this browser only. Clearing it removes everything BharatPlay has recorded — there is
              no copy anywhere else.
            </p>
            <button
              className="btn btn-soft btn-block"
              style={{ marginTop: 16 }}
              onClick={() => {
                reset();
                toast("All demo progress cleared from this browser.", { tone: "ok" });
              }}
            >
              <RotateCcw size={15} /> Clear my demo progress
            </button>
          </section>

          <section className="card card-pad">
            <div className="eyebrow" style={{ color: "var(--sky)" }}>
              EEG data in a real build
            </div>
            <ul style={{ marginTop: 14, display: "grid", gap: 11 }}>
              {[
                "Used live during a game to adjust difficulty — never to judge you.",
                "Processed on the device; raw signals would not be stored.",
                "Never shared with anyone, and never used for advertising.",
                "You could switch the headset off at any time and play without it.",
              ].map((t) => (
                <li key={t} className="row" style={{ gap: 10, alignItems: "flex-start", fontSize: "0.84rem", color: "var(--text-dim)", lineHeight: 1.55 }}>
                  <EyeOff size={15} style={{ color: "var(--sky)", flex: "none", marginTop: 1 }} />
                  {t}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 16 }}>
              <DemoNote>
                In this build, none of the above is active — there is no headset code path. These points describe the
                intended design.
              </DemoNote>
            </div>
          </section>

          <section className="card card-pad">
            <div className="eyebrow" style={{ color: "var(--rose)" }}>
              Children
            </div>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: 10, lineHeight: 1.6 }}>
              BharatPlay is built for young learners, so a real version would ask a parent or teacher to set up the
              account. This prototype deliberately skips all of that — no name, no email, no photo.
            </p>
            <Link to="/how-it-works" className="btn btn-ghost btn-sm" style={{ marginTop: 16, textDecoration: "none" }}>
              See the full flow <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
