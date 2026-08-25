"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";

const STEPS = [
  { num: "01", label: "Story" },
  { num: "02", label: "Visibility" },
  { num: "03", label: "Connections" },
  { num: "04", label: "Opportunities" },
  { num: "05", label: "Influence" },
  { num: "06", label: "Scale" },
];

export default function Amplification() {
  const sectionRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const [activeCount, setActiveCount] = useState(0);
  useReveal(sectionRef);
  useMagnetic(sectionRef);

  useEffect(() => {
    const el = journeyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            STEPS.forEach((_, i) =>
              setTimeout(() => setActiveCount((c) => Math.max(c, i + 1)), i * 140)
            );
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="amplification" id="amplification" ref={sectionRef}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Amplification</span>
          <h2>
            Amplification,
            <br />
            not <span className="accent-text">applause.</span>
          </h2>
          <p className="section-lede">
            A 90-day journey from a good story to real influence not a
            press release, a pipeline.
          </p>
        </div>
        <div className="journey" id="journey" ref={journeyRef}>
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className={`journey-step${i < activeCount ? " active" : ""}`}
              data-j={i}
            >
              <span className="j-num">{s.num}</span>
              <span className="j-label">{s.label}</span>
            </div>
          ))}
        </div>
        <a href="#join" className="btn-primary magnetic">
          Get Amplified
        </a>
      </div>
    </section>
  );
}
