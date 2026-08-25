"use client";

import { useMemo, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

type Result = { org: string; loc: string; impact: string; evidence: string };

const DATASET: Record<string, Result[]> = {
  "women's health": [
    {
      org: "Sugali Tribal Health Collective",
      loc: "Chittoor, AP",
      impact: "4,200 women reached",
      evidence: "Peer-reviewed, 2024",
    },
    {
      org: "HerShield Pilot Programme",
      loc: "Hyderabad, TG",
      impact: "12,000 covered",
      evidence: "NABARD-adjacent DPR",
    },
    {
      org: "Anganwadi Nutrition Bridge",
      loc: "Vizianagaram, AP",
      impact: "860 households",
      evidence: "Field-verified, ongoing",
    },
  ],
  "climate resilience": [
    {
      org: "Cool Roof Entrepreneurs Network",
      loc: "Hyderabad, TG",
      impact: "1.2M sqft covered",
      evidence: "Independently audited",
    },
    {
      org: "Aqua-Agri Livelihoods Cluster",
      loc: "Telangana / AP / Karnataka",
      impact: "200 farmers protected",
      evidence: "Parametric fund, active",
    },
    {
      org: "Community Water Points Programme",
      loc: "3-state tribal belt",
      impact: "3,600 beneficiaries",
      evidence: "Benchmarked, int’l standard",
    },
  ],
  "youth employment": [
    {
      org: "Shape Future Industry 4.0",
      loc: "Telangana / Karnataka",
      impact: "1,000 youth, 3 yrs",
      evidence: "Employer-verified placements",
    },
    {
      org: "TRADE READY Skilling",
      loc: "Multi-state",
      impact: "2,600 candidates",
      evidence: "NSQF-aligned, audited",
    },
    {
      org: "Digital Parity Discovery Track",
      loc: "Statewide",
      impact: "60,000 students",
      evidence: "MIS-tracked",
    },
  ],
  "digital inclusion": [
    {
      org: "AI Learning for All",
      loc: "Pune / Hyderabad",
      impact: "1,000 trained",
      evidence: "NSDC + NIELIT certified",
    },
    {
      org: "Good Universe Academy",
      loc: "Open access",
      impact: "Curriculum in build",
      evidence: "Practitioner-authored",
    },
    {
      org: "Digital Parity Career Track",
      loc: "6 Hubs planned",
      impact: "12,000 target",
      evidence: "Skill India 4.0 aligned",
    },
  ],
  "water security": [
    {
      org: "Community Solar Water Points",
      loc: "KA / AP / TG tribal belt",
      impact: "₹1,389/beneficiary",
      evidence: "41% below int’l benchmark",
    },
    {
      org: "Rainwater Harvesting Network",
      loc: "Deccan plateau",
      impact: "450 structures",
      evidence: "Third-party monitored",
    },
    {
      org: "Jal Jeevan Convergence Pilot",
      loc: "Scheduled Areas",
      impact: "8 water points",
      evidence: "Govt-aligned, verified",
    },
  ],
};

const EXAMPLES = [
  "Women's health",
  "Climate resilience",
  "Youth employment",
  "Digital inclusion",
  "Water security",
];

export default function Intelligence() {
  const ref = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("Women's health");
  useReveal(ref);

  const results = useMemo(() => {
    const key = query.trim().toLowerCase();
    return DATASET[key] ?? [];
  }, [query]);

  return (
    <section className="intelligence" id="intelligence" ref={ref}>
      <div className="wrap">
        <div className="section-head light">
          <span className="eyebrow">Impact Intelligence</span>
          <h2>What are you trying to solve?</h2>
          <p className="section-lede">
            Search across a live index of organisations, evidence and
            partnership opportunities not a directory, an intelligence
            product.
          </p>
        </div>
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle
              cx="8.5"
              cy="8.5"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M17 17L13.4 13.4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            id="searchInput"
            placeholder='Try “climate resilience” or “youth employment”'
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="search-examples">
          {EXAMPLES.map((label) => (
            <button
              key={label}
              className="pill"
              data-q={label}
              onClick={() => setQuery(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="search-results" id="searchResults">
          {results.map((r, i) => (
            <div
              key={r.org}
              className="result-row"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div>
                <span className="rlabel">Organisation</span>
                <h4>{r.org}</h4>
              </div>
              <div>
                <span className="rlabel">Location</span>
                <span className="rval">{r.loc}</span>
              </div>
              <div>
                <span className="rlabel">Impact</span>
                <span className="rval">{r.impact}</span>
              </div>
              <div>
                <span className="rlabel">Evidence</span>
                <span className="rval">{r.evidence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
