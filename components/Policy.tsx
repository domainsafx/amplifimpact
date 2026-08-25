"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";

const COLUMNS = [
  {
    label: "Issue",
    copy: "Tribal habitations across three states remain outside standard piped-network coverage, despite national schemes acknowledging the gap.",
  },
  {
    label: "Stakeholders",
    copy: "State Tribal Welfare Departments · Jal Jeevan Mission · 14 implementation partners · 3,600 households",
  },
  {
    label: "Evidence",
    copy: "Cost-per-beneficiary benchmarked against international point-of-use standards; 18 months of field-verified outcome data.",
  },
  {
    label: "Recommendation",
    copy: "Community-scale solar water points as the tailored intermediate model national policy already calls for but hasn't funded.",
  },
  {
    label: "Action Agenda",
    copy: "3 state-level pilots, 1 convergence framework, 1 costed replication model ready for CSR or government co-funding.",
  },
];

export default function Policy() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  useMagnetic(ref);

  return (
    <section className="policy" id="policy" ref={ref}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Policy Lab</span>
          <h2>Evidence, structured for decision-makers.</h2>
        </div>
        <div className="policy-doc">
          <div className="policy-doc-header">
            <span className="policy-tag">ACTIVE BRIEF · 04</span>
            <h3>Closing the Rural Water Access Gap in Scheduled Areas</h3>
          </div>
          <div className="policy-grid">
            {COLUMNS.map((c) => (
              <div className="policy-col" key={c.label}>
                <span className="policy-label">{c.label}</span>
                <p>{c.copy}</p>
              </div>
            ))}
          </div>
        </div>
        <a href="#" className="btn-ghost magnetic">
          Explore Policy Work
        </a>
      </div>
    </section>
  );
}
