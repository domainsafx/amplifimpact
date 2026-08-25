"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="statement" ref={ref}>
      <div className="wrap">
        <h2 className="statement-headline">
          <span className="line reveal-line">Impact is everywhere.</span>
          <span className="line reveal-line accent-text">
            Connection isn&apos;t.
          </span>
        </h2>
        <p className="statement-copy reveal">
          Across every sector NGOs, government, philanthropy, business,
          academia extraordinary work is happening in isolation.
          AmplifImpact exists to close that distance: to make the right
          people find each other, the right evidence travel, and the right
          ideas scale.
        </p>
      </div>
    </section>
  );
}
