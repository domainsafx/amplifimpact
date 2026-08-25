"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

const HUBS = [
  { name: "Hyderabad", x: 560, y: 230 },
  { name: "Bengaluru", x: 545, y: 260 },
  { name: "Mumbai", x: 500, y: 220 },
  { name: "Delhi", x: 540, y: 175 },
  { name: "Singapore", x: 660, y: 300 },
  { name: "Nairobi", x: 480, y: 300 },
  { name: "London", x: 400, y: 130 },
  { name: "Dubai", x: 490, y: 210 },
];

const center = { x: 450, y: 250 };

export default function Global() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="global" id="global" ref={ref}>
      <div className="wrap">
        <div className="section-head light">
          <span className="eyebrow">Global Network</span>
          <h2>
            Local solutions.
            <br />
            Global conversations.
          </h2>
        </div>
        <div className="globe-wrap">
          <svg viewBox="0 0 900 500" id="globeSvg">
            <g id="globeLines">
              {HUBS.map((h, i) => (
                <g key={h.name}>
                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={h.x}
                    y2={h.y}
                    stroke="#DCE4EC"
                    strokeWidth={1}
                    strokeDasharray="3 4"
                  />
                  <circle
                    className="hub-dot"
                    cx={h.x}
                    cy={h.y}
                    r={6}
                    fill="#2F6BFF"
                    style={{ transition: "r .2s" }}
                    onMouseEnter={(e) =>
                      e.currentTarget.setAttribute("r", "9")
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget.setAttribute("r", "6")
                    }
                  />
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={6}
                    fill="none"
                    stroke="#2F6BFF"
                    strokeWidth={1.5}
                    opacity={0.6}
                  >
                    <animate
                      attributeName="r"
                      from="6"
                      to="22"
                      dur="2.4s"
                      begin={`${i * 0.3}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="2.4s"
                      begin={`${i * 0.3}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <text
                    x={h.x}
                    y={h.y - 14}
                    textAnchor="middle"
                    className="hub-label"
                  >
                    {h.name}
                  </text>
                </g>
              ))}
              <circle cx={center.x} cy={center.y} r={4} fill="#102A43" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
