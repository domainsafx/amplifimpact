"use client";

import { useEffect, useRef, useState } from "react";

const PANELS = [
  {
    num: "01",
    title: "Discover",
    copy: "Surface the people, organisations and evidence already solving the problem you're facing before you start from zero.",
  },
  {
    num: "02",
    title: "Connect",
    copy: "Move from a database entry to a real relationship with the institutions, funders and peers who can actually move things forward.",
  },
  {
    num: "03",
    title: "Amplify",
    copy: "Give proven work the visibility, validation and narrative it needs to reach funders, policymakers and the public.",
  },
  {
    num: "04",
    title: "Act",
    copy: "Turn intelligence and connection into pilots, policy, capital and scale the point where impact stops being a report and starts being real.",
  },
];

export default function Model() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    function update() {
      const pin = pinRef.current;
      if (!pin) return;
      const rect = pin.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      const idx = Math.min(3, Math.floor(p * 4));
      setActive(idx);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="model" id="model">
      <div className="model-pin" ref={pinRef}>
        <div className="model-eyebrow wrap">
          <span className="eyebrow">The Model</span>
        </div>
        <div className="model-panels">
          {PANELS.map((panel, i) => (
            <div
              key={panel.num}
              className={`model-panel${i === active ? " active" : ""}`}
              data-panel={i}
            >
              <span className="model-num">{panel.num}</span>
              <h3>{panel.title}</h3>
              <p>{panel.copy}</p>
            </div>
          ))}
        </div>
        {/* <div className="model-progress" aria-hidden="true">
          {PANELS.map((panel, i) => (
            <span
              key={panel.num}
              data-p={i}
              className={i === active ? "active" : ""}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
}
