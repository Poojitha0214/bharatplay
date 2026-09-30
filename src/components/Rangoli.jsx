/**
 * Decorative rangoli / mandala motif. Pure SVG, very low opacity,
 * used as cultural texture behind screens. It never intercepts clicks.
 */
export default function Rangoli({ size = 560, petals = 16, opacity = 0.14, className = "" }) {
  const rings = [
    { r: 46, rot: 0 },
    { r: 70, rot: 11 },
    { r: 94, rot: 22 },
    { r: 118, rot: 0 },
  ];

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="-140 -140 280 280"
      style={{ opacity, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rangoli-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd166" />
          <stop offset="0.5" stopColor="#ff9f45" />
          <stop offset="1" stopColor="#ff6f4d" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="url(#rangoli-grad)" strokeWidth="0.7">
        {rings.map((ring, i) => (
          <circle key={i} r={ring.r} opacity={0.5 - i * 0.06} />
        ))}
      </g>

      {rings.map((ring, ri) => (
        <g key={`p-${ri}`}>
          {Array.from({ length: ri === 3 ? petals / 2 : petals }).map((_, i) => {
            const a = ((360 / (ri === 3 ? petals / 2 : petals)) * i + ring.rot) * (Math.PI / 180);
            const x = Math.cos(a) * ring.r;
            const y = Math.sin(a) * ring.r;
            const spread = ri === 0 ? 15 : ri === 1 ? 13 : 11;
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx={spread}
                ry={spread * 0.42}
                fill="none"
                stroke="url(#rangoli-grad)"
                strokeWidth="0.65"
                opacity={0.55 - ri * 0.09}
                transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}
              />
            );
          })}
        </g>
      ))}

      <g fill="none" stroke="url(#rangoli-grad)" strokeWidth="0.8">
        {Array.from({ length: petals }).map((_, i) => {
          const a = (360 / petals) * i * (Math.PI / 180);
          const a2 = (360 / petals) * (i + 0.5) * (Math.PI / 180);
          return (
            <path
              key={i}
              d={`M ${Math.cos(a) * 22} ${Math.sin(a) * 22} Q ${Math.cos(a2) * 40} ${Math.sin(a2) * 40} ${Math.cos(a) * 70} ${Math.sin(a) * 70}`}
              opacity="0.35"
            />
          );
        })}
      </g>
    </svg>
  );
}
