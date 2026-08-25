"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const NODES = [
  { key: "people", label: "People", top: "6%", left: "50%" },
  { key: "institutions", label: "Institutions", top: "30%", left: "87%" },
  { key: "capital", label: "Capital", top: "74%", left: "76%" },
  { key: "solutions", label: "Solutions", top: "74%", left: "24%" },
  { key: "influence", label: "Influence", top: "30%", left: "13%" },
] as const;

type NodeKey = (typeof NODES)[number]["key"];

const DATA: Record<NodeKey, string> = {
  people:
    "The founders, fellows, changemakers and civil servants doing the work the starting point every solution actually comes from.",
  institutions:
    "NGOs, government bodies, academic institutions and corporates whose scale turns a working idea into a system-level change.",
  capital:
    "CSR budgets, philanthropic grants, blended finance and impact investment the fuel that determines what gets to run.",
  solutions:
    "The proven models, pilots and interventions worth replicating evaluated, evidenced, and ready to move beyond one site.",
  influence:
    "Policy, media and public narrative the layer that decides whether good work stays local or reshapes what's possible elsewhere.",
};

export default function Ecosystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<NodeKey>("people");
  const [lines, setLines] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);
  useReveal(sectionRef);

  useEffect(() => {
    function drawLines() {
      const computed = NODES.map((n) => {
        const nx = (parseFloat(n.left) / 100) * 800;
        const ny = (parseFloat(n.top) / 100) * 620;
        return { x1: 400, y1: 310, x2: nx, y2: ny };
      });
      setLines(computed);
    }
    drawLines();
    window.addEventListener("resize", drawLines);
    return () => window.removeEventListener("resize", drawLines);
  }, []);

  return (
    <section className="ecosystem" id="ecosystem" ref={sectionRef}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">The Impact Ecosystem</span>
          <h2>Five forces. One system.</h2>
          <p className="section-lede">
            Impact doesn&apos;t move in a straight line. It moves through
            relationships between people, institutions, capital, solutions
            and influence hover to see how.
          </p>
        </div>
        <div className="eco-diagram" id="ecoDiagram">
          <svg viewBox="0 0 800 620" id="ecoSvg" aria-hidden="true" ref={svgRef}>
            <g id="ecoLines">
              {lines.map((l, i) => (
                <line
                  key={i}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="#DCE4EC"
                  strokeWidth={1}
                />
              ))}
            </g>
          </svg>
          {NODES.map((n) => (
            <div
              key={n.key}
              className={`eco-node${active === n.key ? " active" : ""}`}
              data-node={n.key}
              style={{ top: n.top, left: n.left }}
              onMouseEnter={() => setActive(n.key)}
              onClick={() => setActive(n.key)}
            >
              <span>{n.label}</span>
            </div>
          ))}
          <div className="eco-center">AmplifImpact</div>
        </div>
        <div className="eco-panel" id="ecoPanel">
          <p className="eco-panel-hint">Hover a force above, or select one:</p>
          <div className="eco-panel-body" id="ecoPanelBody">
            {DATA[active]}
          </div>
        </div>
      </div>
    </section>
  );
}
