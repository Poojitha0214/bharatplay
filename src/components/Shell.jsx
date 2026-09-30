import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  House,
  Brain,
  Gamepad2,
  Compass,
  Hammer,
  ChartLine,
  Orbit,
  ShieldCheck,
  Cpu,
  RotateCcw,
  Waves,
} from "lucide-react";
import { useApp } from "../lib/store";

export const NAV = [
  { to: "/", label: "Home", Icon: House, end: true, accent: "var(--a-play)" },
  { to: "/focus", label: "Focus", Icon: Brain, accent: "var(--a-focus)" },
  { to: "/play", label: "Play", Icon: Gamepad2, accent: "var(--a-play)" },
  { to: "/discover", label: "Discover", Icon: Compass, accent: "var(--a-discover)" },
  { to: "/create", label: "Create", Icon: Hammer, accent: "var(--a-create)" },
  { to: "/progress", label: "My Progress", Icon: ChartLine, accent: "var(--teal)", short: "Report" },
];

const TITLES = {
  "/": "Dashboard",
  "/focus": "Focus",
  "/focus/drive": "Focus Drive",
  "/play": "Play",
  "/play/chakravyuha": "Chakravyuha",
  "/play/mahabharata": "Mahabharata",
  "/play/traditions": "Indian Traditions",
  "/discover": "Discover India",
  "/create": "Create",
  "/progress": "My BharatPlay Report",
  "/how-it-works": "How BharatPlay Works",
  "/privacy": "Privacy & Data",
};

function BrandMark() {
  return (
    <span className="brand-mark">
      <Orbit size={20} style={{ color: "var(--marigold)" }} />
    </span>
  );
}

export default function Shell({ children }) {
  const location = useLocation();
  const { eegEverConnected, reset, toast } = useApp();
  const [eegNow, setEegNow] = useState(false);

  // A tiny event channel so the topbar reflects live EEG state anywhere.
  useEffect(() => {
    const on = () => setEegNow(true);
    const off = () => setEegNow(false);
    window.addEventListener("bp:eeg-on", on);
    window.addEventListener("bp:eeg-off", off);
    return () => {
      window.removeEventListener("bp:eeg-on", on);
      window.removeEventListener("bp:eeg-off", off);
    };
  }, []);

  const title = TITLES[location.pathname] ?? "BharatPlay";

  return (
    <div className="app">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <BrandMark />
          <span className="brand-text">
            <span className="brand-name">BHARATPLAY</span>
            <br />
            <span className="brand-sub">Learn · Play · Create</span>
          </span>
        </NavLink>

        <nav style={{ flex: 1, overflowY: "auto" }}>
          <div className="nav-group-label">Explore</div>
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end} aria-label={label} title={label} className={({ isActive }) => `nav-item ${isActive ? "on" : ""}`}>
              <Icon size={19} className="nav-ico" />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}

          <div className="nav-group-label">The idea</div>
          <NavLink to="/how-it-works" aria-label="How It Works" title="How It Works" className={({ isActive }) => `nav-item ${isActive ? "on" : ""}`}>
            <Cpu size={19} className="nav-ico" />
            <span className="nav-label">How It Works</span>
          </NavLink>
          <NavLink to="/privacy" aria-label="Privacy" title="Privacy" className={({ isActive }) => `nav-item ${isActive ? "on" : ""}`}>
            <ShieldCheck size={19} className="nav-ico" />
            <span className="nav-label">Privacy</span>
          </NavLink>
        </nav>

        <div className="side-foot" style={{ paddingTop: 10, borderTop: "1px solid var(--stroke)" }}>
          <button
            className="nav-item"
            aria-label="Reset demo data"
            title="Reset demo data"
            onClick={() => {
              reset();
              toast("Demo progress cleared. Starting fresh.", { tone: "info" });
            }}
          >
            <RotateCcw size={18} className="nav-ico" />
            <span className="nav-label">Reset demo data</span>
          </button>
          <div className="nav-label side-foot-text" style={{ fontSize: "0.66rem", color: "var(--text-faint)", padding: "8px 13px 0", lineHeight: 1.5 }}>
            Prototype build · all device readings are simulated.
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="grow" style={{ minWidth: 0 }}>
            <h1 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h1>
          </div>

          <div className="row" style={{ gap: 8 }}>
            <span className="pill hide-sm">
              <Waves size={13} style={{ color: eegNow ? "var(--teal)" : "var(--text-faint)" }} />
              {eegNow ? "EEG demo live" : eegEverConnected ? "EEG demo · idle" : "EEG demo · off"}
            </span>
            <span className="pill-demo">Prototype</span>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>

      <nav className="tabbar">
        <div className="tabbar-in">
          {NAV.map(({ to, label, short, Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `tab ${isActive ? "on" : ""}`}>
              {({ isActive }) => (
                <>
                  <Icon size={19} className="tab-ico" strokeWidth={isActive ? 2.3 : 1.8} />
                  <span>{short ?? label.split(" ")[0]}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
