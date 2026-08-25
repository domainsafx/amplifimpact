"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

const FELLOWS = [
  { initials: "AK", name: "Aanya Krishnan", role: "Maternal Health Systems", lg: true },
  { initials: "DM", name: "David Mwangi", role: "Climate Adaptation Finance", lg: false },
  { initials: "RS", name: "Ravi Shastri", role: "Rural Water Infrastructure", lg: false },
  { initials: "LC", name: "Li Chen", role: "Youth Employment & GCCs", lg: true },
  { initials: "FO", name: "Fatima Osei", role: "Beekeeping & Livelihoods", lg: false },
  { initials: "JP", name: "James Patel", role: "Parametric Risk Design", lg: false },
];

export default function Fellows() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="fellows" id="fellows" ref={ref}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Fellows</span>
          <h2>The people carrying this work forward.</h2>
        </div>
        <div className="fellows-grid">
          {FELLOWS.map((f) => (
            <div className={`fellow${f.lg ? " fellow--lg" : ""}`} key={f.initials}>
              <div className="fellow-portrait" data-initials={f.initials} />
              <h4>{f.name}</h4>
              <span>{f.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
