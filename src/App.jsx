import { useCallback, useState } from "react";
import { HashRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AppProvider } from "./lib/store";
import Shell from "./components/Shell";
import Toasts from "./components/ui";
import Welcome from "./screens/Welcome";
import Dashboard from "./screens/Dashboard";
import Focus from "./screens/Focus";
import FocusDrive from "./screens/FocusDrive";
import Play from "./screens/Play";
import Chakravyuha from "./screens/Chakravyuha";
import Mahabharata from "./screens/Mahabharata";
import Traditions from "./screens/Traditions";
import Discover from "./screens/Discover";
import Create from "./screens/Create";
import Report from "./screens/Report";
import HowItWorks from "./screens/HowItWorks";
import Privacy from "./screens/Privacy";

/* Routes a judge can reach without "starting" the app first. */
const OPEN_ROUTES = ["/how-it-works", "/privacy"];

function Backdrop() {
  return (
    <>
      <div className="aurora">
        <span />
        <span />
        <span />
      </div>
      <div className="vignette" />
    </>
  );
}

function Routed() {
  const navigate = useNavigate();
  // A judge may paste a deep link or press Back before starting — keep those routes working.
  const [started, setStarted] = useState(() => OPEN_ROUTES.includes(window.location.hash.replace("#", "")));

  const onStart = useCallback(() => {
    setStarted(true);
    if (!window.location.hash || window.location.hash === "#") navigate("/");
  }, [navigate]);

  const onExplore = useCallback(() => {
    setStarted(true);
    navigate("/how-it-works");
  }, [navigate]);

  if (!started) return <Welcome onStart={onStart} onExplore={onExplore} />;

  return (
    <>
      <Backdrop />
      <Shell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/focus/drive" element={<FocusDrive />} />
          <Route path="/play" element={<Play />} />
          <Route path="/play/chakravyuha" element={<Chakravyuha />} />
          <Route path="/play/mahabharata" element={<Mahabharata />} />
          <Route path="/play/traditions" element={<Traditions />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/create" element={<Create />} />
          <Route path="/progress" element={<Report />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routed />
      </HashRouter>
      <Toasts />
    </AppProvider>
  );
}
