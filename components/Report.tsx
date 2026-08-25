"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";

const STATS = [
  { target: 14200, label: "Organisations indexed", format: "number" as const },
  { target: 86, label: "Countries represented", format: "number" as const },
  { target: 412, label: "Verified partnerships formed", format: "number" as const },
  {
    target: 2100000000,
    label: "Capital connected to solutions",
    format: "currency" as const,
  },
];

function useCountUp(target: number, format: "number" | "currency") {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const t0 = performance.now();
            const dur = 1600;
            function tick(t: number) {
              const p = Math.min(1, (t - t0) / dur);
              const val = Math.floor(p * target);
              setDisplay(
                format === "currency"
                  ? "$" + (val / 1e9).toFixed(2) + "B"
                  : val.toLocaleString()
              );
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, format]);

  return { ref, display };
}

function Stat({
  target,
  label,
  format,
}: {
  target: number;
  label: string;
  format: "number" | "currency";
}) {
  const { ref, display } = useCountUp(target, format);
  return (
    <div className="rstat">
      <span
        className="rstat-num"
        data-count={target}
        data-format={format === "currency" ? "currency" : undefined}
        ref={ref}
      >
        {display}
      </span>
      <span className="rstat-label">{label}</span>
    </div>
  );
}

export default function Report() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  useMagnetic(ref);

  return (
    <section className="report" id="report" ref={ref}>
      <div className="wrap report-wrap">
        <div className="report-cover">
          <span className="report-year">2027</span>
          <h3>
            State of
            <br />
            Social Impact
          </h3>
          <span className="report-sub">Annual Report</span>
        </div>
        <div className="report-body">
          <span className="eyebrow">Annual Report</span>
          <h2>A year of impact, measured.</h2>
          <div className="report-stats">
            {STATS.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
          <a href="#" className="btn-primary magnetic">
            Download Report
          </a>
        </div>
      </div>
    </section>
  );
}
