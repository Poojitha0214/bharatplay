import { useEffect, useRef, useState } from "react";

/* =============================================================
   SIMULATED SIGNAL ENGINE
   ------------------------------------------------------------
   This file produces numbers that *look* like readings from an
   EEG headset or a sensor kit. Nothing is measured. There is no
   device connection anywhere in this prototype — every value is
   generated in the browser with smooth noise.
   ============================================================= */

const rand = (a, b) => a + Math.random() * (b - a);

function wander(current, target, step, jitter) {
  const pull = (target - current) * 0.06;
  return current + pull + rand(-jitter, jitter) + (Math.random() < 0.04 ? rand(-step, step) : 0);
}

/**
 * Simulated attention stream. Returns attention %, workload, signal
 * quality and a small set of frequency-band values for visualisation.
 */
export function useSimulatedEeg(connected) {
  const [reading, setReading] = useState({
    attention: 62,
    workload: "Light",
    signal: 0,
    theta: 0.3,
    alpha: 0.4,
    beta: 0.25,
    gamma: 0.12,
  });
  const drift = useRef({ attention: 62, bias: 0 });

  useEffect(() => {
    if (!connected) return undefined;

    let last = performance.now();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (now - last < 480) return;
      last = now;

      const d = drift.current;
      if (Math.random() < 0.045) d.bias = rand(-9, 8);

      d.attention = Math.max(38, Math.min(97, wander(d.attention, 78 + d.bias, 3, 2.4)));

      const a = d.attention;
      setReading({
        attention: Math.round(a),
        workload: a > 84 ? "High" : a > 62 ? "Moderate" : "Light",
        signal: Math.round(Math.max(58, Math.min(99, 88 + rand(-9, 10)))),
        theta: Math.max(0.05, Math.min(1, (100 - a) / 100 + rand(-0.05, 0.08))),
        alpha: Math.max(0.05, Math.min(1, 0.62 - (a - 70) / 160 + rand(-0.04, 0.06))),
        beta: Math.max(0.05, Math.min(1, (a - 55) / 90 + rand(-0.04, 0.06))),
        gamma: Math.max(0.02, Math.min(0.9, (a - 72) / 70 + rand(-0.03, 0.05))),
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [connected]);

  return reading;
}

/** Smoothly wandering value for demo sensor gauges. Returns null while inactive. */
export function useSimulatedSensor({ key: k, min, max, active, speed = 0.5, seed = 0 }) {
  const [value, setValue] = useState((min + max) / 2);
  const stateRef = useRef({ v: (min + max) / 2, target: (min + max) / 2, t: seed });

  useEffect(() => {
    if (!active) return undefined;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 220) return;
      last = now;
      const s = stateRef.current;
      if (Math.random() < 0.14) s.target = rand(min, max);
      s.v += (s.target - s.v) * speed;
      setValue(Number(s.v.toFixed(k === "temp" ? 1 : 0)));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, min, max, speed, k]);

  return active ? value : null;
}

/** Battery-style slow drain, used for the demo RC car. */
export function useSimulatedBattery(active, start = 86) {
  const [level, setLevel] = useState(start);
  const ref = useRef(start);
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => {
      ref.current = Math.max(11, ref.current - Math.random() * 0.35);
      setLevel(Number(ref.current.toFixed(1)));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);
  return level;
}

/** Slow-noise helper used by decorative canvases. */
export function makeNoise(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}
