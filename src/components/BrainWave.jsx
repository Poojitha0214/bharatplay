import { useEffect, useRef } from "react";

/**
 * Animated brain-wave style visualisation.
 * Decorative only — it draws invented signals, it does not read a device.
 */
export default function BrainWave({ active = false, bands, height = 96, hue = "warm" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const palette =
      hue === "cool"
        ? ["#93a6ff", "#6cc6ff", "#43d9c0"]
        : ["#ffd166", "#ff9f45", "#ff6f4d"];

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += active ? 0.016 : 0.006;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // faint grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += 26) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
        ctx.stroke();
      }

      const amps = active ? [0.32, 0.5, 0.72] : [0.12, 0.18, 0.24];
      const freqs = active ? [2.6, 4.4, 7.6] : [1.5, 2.3, 3.6];

      amps.forEach((amp, i) => {
        ctx.beginPath();
        const bandBoost = 1 + (bands?.[i] ?? 0.3) * (active ? 1.6 : 0.5);
        for (let x = 0; x <= w; x += 2) {
          const p = x / w;
          const env = Math.sin(p * Math.PI);
          const y =
            h / 2 +
            Math.sin(p * 6.2832 * freqs[i] + t * (2.2 + i * 0.9)) * (amp * bandBoost * env * h * 0.5) +
            Math.sin(p * 6.2832 * freqs[i] * 2.7 + t * (3.1 + i)) * (amp * 0.22 * env * h);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, `${palette[i]}00`);
        grad.addColorStop(0.35, palette[i]);
        grad.addColorStop(1, `${palette[i]}22`);
        ctx.strokeStyle = active ? grad : `${palette[i]}55`;
        ctx.lineWidth = i === 0 ? 1.6 : 2;
        ctx.shadowBlur = active ? 10 : 0;
        ctx.shadowColor = `${palette[i]}88`;
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active, bands, hue]);

  return (
    <div className="panel" style={{ padding: "12px 14px", overflow: "hidden" }}>
      <canvas ref={ref} style={{ width: "100%", height, display: "block" }} aria-hidden="true" />
      <div className="row wrap" style={{ gap: 14, marginTop: 8 }}>
        {[
          ["Theta", "relaxed", "var(--indigo)"],
          ["Alpha", "calm", "var(--sky)"],
          ["Beta", "active", "var(--teal)"],
        ].map(([b, label, c]) => (
          <div key={b} className="row" style={{ gap: 6 }}>
            <span className="dot" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
            <span style={{ fontSize: "0.7rem", color: "var(--text-faint)", letterSpacing: "0.04em" }}>
              {b} <span style={{ color: "var(--text-dim)" }}>· {label}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
