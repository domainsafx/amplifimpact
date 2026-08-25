"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";

export default function Challenge() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  useMagnetic(ref);

  return (
    <section className="challenge" ref={ref}>
      <div className="wrap">
        <span className="eyebrow light">Impact Challenges</span>
        <h2 className="challenge-headline">
          &quot;How might we improve adolescent health outcomes across rural
          India?&quot;
        </h2>
        <div className="challenge-ctas">
          <a href="#" className="btn-primary magnetic">
            Submit a Solution
          </a>
          <a href="#" className="btn-ghost-light magnetic">
            Post a Challenge
          </a>
        </div>
      </div>
    </section>
  );
}
