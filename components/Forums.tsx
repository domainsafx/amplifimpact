"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

const FORUMS = [
  {
    date: "14–16 MAR 2027",
    title: "Climate Resilience Forum",
    city: "Nairobi",
    copy: "Adaptation financing, community-led resilience models, and the case for local-first climate capital.",
    meta: ["420 participants", "18 policy commitments"],
  },
  {
    date: "02–03 JUN 2027",
    title: "Future of Work Summit",
    city: "Singapore",
    copy: "Youth employment, GCC-driven skilling models, and the widening access gap in emerging technology careers.",
    meta: ["610 participants", "12 pilot partnerships"],
  },
  {
    date: "21 SEP 2027",
    title: "Women's Health Roundtable",
    city: "Hyderabad",
    copy: "Closing the maternal and adolescent health evidence gap across South Asia's fastest-growing districts.",
    meta: ["180 participants", "1 policy brief published"],
  },
  {
    date: "11–12 NOV 2027",
    title: "Capital for Communities",
    city: "London",
    copy: "Blended finance and parametric protection mechanisms for climate-exposed informal workers.",
    meta: ["350 participants", "£18M committed"],
  },
  {
    date: "05 DEC 2027",
    title: "Digital Inclusion Assembly",
    city: "Dubai",
    copy: "Closing the emerging-technology access gap for underserved youth across the Global South.",
    meta: ["290 participants", "6 corridor partnerships"],
  },
];

export default function Forums() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="forums" id="forums" ref={ref}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Forums</span>
          <h2>Year-round convening, not one annual event.</h2>
        </div>
      </div>

      <div className="forum-scroll">
        {FORUMS.map((f) => (
          <div className="forum-entry" key={f.title}>
            <span className="forum-date">{f.date}</span>

            <h3>{f.title}</h3>

            <span className="forum-city">{f.city}</span>

            <p>{f.copy}</p>

            <div className="forum-meta">
              <span>{f.meta[0]}</span>
              <span>·</span>
              <span>{f.meta[1]}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}