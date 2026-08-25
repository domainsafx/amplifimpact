"use client";

import { useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const OPTIONS = [
  "Join",
  "Partner",
  "Sponsor",
  "Post Challenge",
  "Submit Solution",
  "Media",
  "Speak",
  "Research",
] as const;

const MAP: Record<(typeof OPTIONS)[number], string> = {
  Join: "We’ll route you into the network based on who you are and what you’re looking for head to the Join section above, it takes about a minute.",
  Partner:
    "Tell us about your organisation and where you see alignment our partnerships team responds within 3 working days.",
  Sponsor:
    "Forums, Studio features and the Impact Index all carry sponsorship opportunities we’ll send a current media kit.",
  "Post Challenge":
    "Describe the problem you’re trying to solve we’ll structure it for the Impact Exchange and route it to matched solvers.",
  "Submit Solution":
    "Tell us what you’ve built and what evidence exists our Index team reviews every submission within 2 weeks.",
  Media:
    "Press enquiries, interview requests and data requests go directly to our editorial desk.",
  Speak:
    "Share the forum or theme you’re interested in our Forums team reviews all speaker proposals quarterly.",
  Research:
    "Access anonymised index data or propose a joint study our research desk responds within a week.",
};

export default function ContactExp() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [selected, setSelected] = useState<(typeof OPTIONS)[number] | null>(
    null
  );

  return (
    <section className="contact-exp" id="contact" ref={ref}>
      <div className="wrap">
        <span className="eyebrow">Get in Touch</span>
        <h2>Let&apos;s find the right way to work together.</h2>
        <p className="section-lede">What brings you here?</p>
        <div className="contact-options" id="contactOptions">
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              data-c={opt}
              className={selected === opt ? "selected" : ""}
              onClick={() => setSelected(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <div
          className="contact-reveal"
          id="contactReveal"
          style={{
            opacity: selected ? 1 : 0,
            transition: selected ? "opacity .4s" : undefined,
          }}
        >
          {selected ? MAP[selected] : ""}
        </div>
      </div>
    </section>
  );
}
