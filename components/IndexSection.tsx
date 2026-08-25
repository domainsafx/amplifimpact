"use client";

import { useMemo, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";

const LABELS = [
  "Impact Evidence",
  "Innovation",
  "Governance",
  "Community Ownership",
  "Scale",
  "Sustainability",
  "Replicability",
];

const PRESETS = [
  { name: "Community Water Programme", values: [8, 6, 7, 9, 6, 8, 7] },
  { name: "Digital Skilling Initiative", values: [7, 9, 6, 6, 8, 6, 8] },
  { name: "Climate Insurance Pilot", values: [9, 8, 7, 5, 7, 9, 6] },
];

const cx = 200,
  cy = 200,
  R = 150;

function point(i: number, val: number) {
  const angle = (Math.PI * 2 * i) / LABELS.length - Math.PI / 2;
  const r = (val / 10) * R;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

export default function IndexSection() {
  const ref = useRef<HTMLElement>(null);
  const [preset, setPreset] = useState(0);
  useReveal(ref);
  useMagnetic(ref);

  const values = PRESETS[preset].values;

  const rings = useMemo(() => {
    const out: string[] = [];
    for (let ring = 1; ring <= 4; ring++) {
      const pts = LABELS.map((_, i) => {
        const angle = (Math.PI * 2 * i) / LABELS.length - Math.PI / 2;
        const r = (ring / 4) * R;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      }).join(" ");
      out.push(pts);
    }
    return out;
  }, []);

  const spokes = useMemo(
    () =>
      LABELS.map((label, i) => {
        const angle = (Math.PI * 2 * i) / LABELS.length - Math.PI / 2;
        const x2 = cx + R * Math.cos(angle);
        const y2 = cy + R * Math.sin(angle);
        const lx = cx + (R + 34) * Math.cos(angle);
        const ly = cy + (R + 34) * Math.sin(angle);
        return { label, x2, y2, lx, ly };
      }),
    []
  );

  const dataPoints = useMemo(
    () => values.map((v, i) => point(i, v)),
    [values]
  );
  const dataPolygon = dataPoints.map((p) => p.join(",")).join(" ");

  return (
    <section className="index-sec" id="index-section" ref={ref}>
      <div className="wrap">
        <div className="section-head light">
          <span className="eyebrow">The Impact Index</span>
          <h2>Assess what actually predicts lasting impact.</h2>
        </div>
        <div className="index-body">
          <div className="radar-wrap">
            <svg viewBox="0 0 400 400" id="radarSvg">
              {rings.map((pts, i) => (
                <polygon
                  key={i}
                  points={pts}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                />
              ))}
              {spokes.map((s) => (
                <g key={s.label}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={s.x2}
                    y2={s.y2}
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <text
                    x={s.lx}
                    y={s.ly}
                    textAnchor="middle"
                    className="hub-label"
                    fill="#7A93AA"
                    fontSize="9.5"
                  >
                    {s.label.split(" ")[0]}
                  </text>
                </g>
              ))}
              <polygon
                points={dataPolygon}
                fill="rgba(66,217,255,0.18)"
                stroke="#42D9FF"
                strokeWidth={2}
              />
              {dataPoints.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={3.5} fill="#42D9FF" />
              ))}
            </svg>
          </div>
          <div className="index-controls">
            <p className="section-lede light-sub">
              Seven indicators, benchmarked across the AmplifImpact 1000.
            </p>
            <div className="index-presets">
              {PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  className={`pill pill-dark${preset === i ? " active" : ""}`}
                  data-preset={i}
                  onClick={() => setPreset(i)}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <ul className="index-legend" id="indexLegend">
              {LABELS.map((l, i) => (
                <li key={l}>
                  {l} <b>{values[i]}/10</b>
                </li>
              ))}
            </ul>
            <a href="#" className="btn-ghost-light magnetic">
              Explore the Index
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
