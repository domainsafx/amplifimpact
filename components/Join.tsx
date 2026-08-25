"use client";

import { useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";

const WHO_OPTIONS = [
  "Corporate",
  "NGO",
  "Government",
  "Social Entrepreneur",
  "Philanthropy",
  "Academic",
  "Technology",
  "Individual",
];

const WANT_OPTIONS = [
  "Connect",
  "Learn",
  "Amplify",
  "Fund",
  "Collaborate",
  "Influence",
  "Solve",
];

export default function Join() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  useMagnetic(ref);

  const [step, setStep] = useState(1);
  const [who, setWho] = useState("");
  const [want, setWant] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function pickWho(val: string) {
    setWho(val);
    setTimeout(() => setStep(2), 350);
  }
  function pickWant(val: string) {
    setWant(val);
    setTimeout(() => setStep(3), 350);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="join" id="join" ref={ref}>
      <div className="wrap">
        <div className={`join-step${step === 1 ? " active" : ""}`} data-step={1}>
          <span className="eyebrow light">Step 1 of 3</span>
          <h2>Who are you?</h2>
          <div className="join-options" data-group="who">
            {WHO_OPTIONS.map((opt) => (
              <button
                key={opt}
                data-val={opt}
                className={who === opt ? "selected" : ""}
                onClick={() => pickWho(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className={`join-step${step === 2 ? " active" : ""}`} data-step={2}>
          <span className="eyebrow light">Step 2 of 3</span>
          <h2>What are you looking for?</h2>
          <div className="join-options" data-group="want">
            {WANT_OPTIONS.map((opt) => (
              <button
                key={opt}
                data-val={opt}
                className={want === opt ? "selected" : ""}
                onClick={() => pickWant(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className={`join-step${step === 3 ? " active" : ""}`} data-step={3}>
          <span className="eyebrow light">Step 3 of 3</span>
          <h2 id="joinSummary">
            {who ? `Welcome, ${who}.` : "Join the Network"}
          </h2>
          <p className="join-summary-sub" id="joinSummarySub">
            {want
              ? `We'll route you toward ways to ${want.toLowerCase()} tell us how to reach you.`
              : "Tell us a little about you and we'll route you to the right place."}
          </p>
          <form className="join-form" id="joinForm" onSubmit={handleSubmit}>
            <input type="text" placeholder="Full name" required />
            <input type="email" placeholder="Email address" required />
            <input type="text" placeholder="Organisation (optional)" />
            <button
              type="submit"
              className="btn-primary magnetic"
              style={submitted ? { opacity: 0.7 } : undefined}
            >
              {submitted ? "Welcome to the network ✓" : "Join the Network"}
            </button>
          </form>
        </div>
        <div className="join-progress" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`jp${n <= step ? " active" : ""}`} data-jp={n} />
          ))}
        </div>
      </div>
    </section>
  );
}
