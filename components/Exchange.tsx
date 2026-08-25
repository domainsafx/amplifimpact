"use client";

import { Fragment, useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";

const FLOW = [
  "Corporate Challenge",
  "Impact Discovery",
  "Validation",
  "Connection",
  "Pilot",
  "Scale",
];

export default function Exchange() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  useMagnetic(ref);

  return (
    <section className="exchange" id="exchange" ref={ref}>
      <div className="wrap">
        <div className="section-head light">
          <span className="eyebrow">The Impact Exchange</span>
          <h2>From corporate challenge to scaled solution.</h2>
        </div>
        <div className="exchange-flow">
          {FLOW.map((step, i) => (
            <Fragment key={step}>
              <div
                className={`ex-step${step === "Scale" ? " highlight" : ""}`}
              >
                <span>{step}</span>
              </div>
              {i < FLOW.length - 1 && <div className="ex-arrow">→</div>}
            </Fragment>
          ))}
        </div>
        <a href="#join" className="btn-ghost-light magnetic">
          Explore the Exchange
        </a>
      </div>
    </section>
  );
}
