 "use client";

import { useEffect, useMemo, useState } from "react";

type NodeKey =
  | "people"
  | "institutions"
  | "capital"
  | "solutions"
  | "influence";

type ForceData = {
  color: string;
  // count: string;
  title: string;
  desc: string;
  chips: string[];
  gives: string;
  needs: string;
  live: string;
  cta: string;
};

type LoopStep = {
  from: string;
  to: string;
  key: NodeKey;
  move: string;
  detail: string;
};

const ORDER: NodeKey[] = [
  "people",
  "institutions",
  "capital",
  "solutions",
  "influence",
];

const POINTS: Record<NodeKey, [number, number]> = {
  people: [500, 120],
  institutions: [861, 383],
  capital: [723, 807],
  solutions: [277, 807],
  influence: [139, 383],
};

const ANGLES: Record<NodeKey, number> = {
  people: -90,
  institutions: -18,
  capital: 54,
  solutions: 126,
  influence: 198,
};

const DATA: Record<NodeKey, ForceData> = {
  people: {
    color: "#42D9FF",
    // count: "11,400",
    title: "People start everything.",
    desc:
      "Founders, fellows, civil servants, community organisers. Every model in the index began as somebody who refused to accept a local failure as permanent.",
    chips: [
      "Founders & fellows",
      "Frontline organisers",
      "Civil servants",
      "Practitioner networks",
    ],
    gives: "Lived insight and delivery",
    needs: "Capital, visibility, peers",
    live:
      "312 practitioners joined in the last 90 days across 41 countries — 6 in 10 are looking for their first institutional partner.",
    cta: "Join as a practitioner",
  },
  institutions: {
    color: "#2F6BFF",
    // count: "2,340",
    title: "Institutions carry the weight.",
    desc:
      "NGOs, governments, corporates and universities. They rarely invent the model — they are what turns a working idea into something a whole district can rely on.",
    chips: [
      "NGOs & nonprofits",
      "Government bodies",
      "Corporate CSR",
      "Universities",
    ],
    gives: "Scale, mandate, continuity",
    needs: "Proven models, evidence",
    live:
      "87 institutions have open partnership mandates right now, 34 of them tied to a stated CSR budget for this fiscal year.",
    cta: "Register your institution",
  },
  capital: {
    color: "#B7E36B",
    // count: "$480M",
    title: "Capital decides what gets to run.",
    desc:
      "CSR budgets, philanthropic grants, blended finance, impact investment. Not a scoreboard — a constraint. What is fundable this quarter is what exists next year.",
    chips: [
      "CSR budgets",
      "Philanthropy",
      "Blended finance",
      "Impact investment",
    ],
    gives: "Runway and risk tolerance",
    needs: "Diligence-ready pipeline",
    live:
      "$480M tracked across 214 active funding lines; 29 funders are currently short of qualified pipeline in climate and health.",
    cta: "Deploy through the network",
  },
  solutions: {
    color: "#FF6B5E",
    // count: "1,920",
    title: "Solutions are the unit of transfer.",
    desc:
      "Proven models, live pilots, open tools. Indexed with their evidence, their cost per outcome and the conditions they actually need to work somewhere else.",
    chips: [
      "Proven models",
      "Live pilots",
      "Open tools",
      "Replication packs",
    ],
    gives: "Transferable method",
    needs: "Funding, field partners",
    live:
      "1,920 indexed solutions; 168 are marked replication-ready with a named team willing to support a second site.",
    cta: "Submit a solution",
  },
  influence: {
    color: "#F4A259",
    // count: "140",
    title: "Influence sets the ceiling.",
    desc:
      "Policy, media, public narrative. The layer that decides whether good work stays a case study in one district or becomes the default everywhere.",
    chips: [
      "Policy engagement",
      "Media & narrative",
      "Standards bodies",
      "Public campaigns",
    ],
    gives: "Legitimacy and reach",
    needs: "Evidence worth citing",
    live:
      "140 policy citations traced back to network evidence, across 19 governments and 4 multilateral frameworks.",
    cta: "Bring a policy brief",
  },
};

const LOOP: LoopStep[] = [
  {
    from: "People",
    to: "Institutions",
    key: "people",
    move: "Conviction becomes mandate",
    detail: "A practitioner’s fix gets adopted as somebody’s official programme.",
  },
  {
    from: "Institutions",
    to: "Capital",
    key: "institutions",
    move: "Delivery attracts money",
    detail:
      "Credible institutional capacity is what makes a budget line defensible.",
  },
  {
    from: "Capital",
    to: "Solutions",
    key: "capital",
    move: "Funding proves what works",
    detail:
      "Money buys the pilot, the evaluation and the honest negative result.",
  },
  {
    from: "Solutions",
    to: "Influence",
    key: "solutions",
    move: "Evidence shifts the rules",
    detail:
      "A model with numbers behind it becomes a policy argument.",
  },
  {
    from: "Influence",
    to: "People",
    key: "influence",
    move: "Rules change what’s possible",
    detail:
      "New policy opens ground the next practitioner gets to build on.",
  },
];

const TICKER = [
  "Capital → Solutions · A climate fund shortlisted four cool-roof models for a second city.",
  "People → Institutions · A fellow’s nutrition pilot was adopted as a district programme.",
  "Solutions → Influence · Evaluation data from three states entered a national skilling consultation.",
  "Institutions → Capital · Two corporates pooled CSR budgets behind one water programme.",
  "Influence → People · A procurement rule change opened public contracts to 60 small NGOs.",
];

const hexToRgba = (hex: string, alpha: number) => {
  const value = parseInt(hex.replace("#", ""), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ecosystemStyles = `
.ecosystem {
  position: relative;
  overflow: hidden;
  background: #071827;
  color: #fff;
  font-family: "Inter", sans-serif;
  padding: clamp(56px, 8vw, 130px) clamp(20px, 5vw, 60px);
}

.ecosystem-glow {
  position: absolute;
  top: -10%;
  left: 50%;
  width: min(1100px, 120%);
  aspect-ratio: 1;
  transform: translateX(-50%);
  background: radial-gradient(
    circle,
    rgba(47, 107, 255, 0.16),
    transparent 62%
  );
  pointer-events: none;
}

.ecosystem-wrap {
  position: relative;
  max-width: 1240px;
  margin: 0 auto;
}

.ecosystem-header {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: clamp(32px, 5vw, 60px);
}

.ecosystem-intro {
  max-width: 660px;
}

.ecosystem-eyebrow,
.loop-section-label,
.loop-button,
.loop-hint,
.force-label,
.force-chips span,
.force-exchange span,
.force-live > span,
.ticker-label,
.ecosystem-satellite {
  font-family: "IBM Plex Mono", monospace;
}

.ecosystem-eyebrow {
  font-size: 11.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #42d9ff;
}

.ecosystem-intro h2 {
  margin: 16px 0 0;
  color: #fff;
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(30px, 4.6vw, 52px);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.022em;
}

.ecosystem-intro p {
  margin: 16px 0 0;
  color: #afc2d6;
  font-size: 17px;
  line-height: 1.55;
  text-wrap: pretty;
}

.ecosystem-loop-control {
  display: flex;
  min-width: 180px;
  flex-direction: column;
  gap: 10px;
}

.loop-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 11px 20px;
  border-radius: 100px;
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: 0.2s;
}

.loop-button.running {
  border: 1px solid rgba(183, 227, 107, 0.5);
  background: rgba(183, 227, 107, 0.12);
  color: #b7e36b;
}

.loop-button.paused {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.04);
  color: #afc2d6;
}

.loop-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.loop-hint {
  color: #5b7690;
  font-size: 11px;
  line-height: 1.5;
}

.ecosystem-main {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(28px, 4vw, 56px);
  align-items: center;
}

.ecosystem-diagram {
  position: relative;
  flex: 1 1 440px;
  min-width: 300px;
  max-width: 620px;
  aspect-ratio: 1;
  margin: 0 auto;
}

.ecosystem-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.outer-orbit {
  transform-origin: 500px 500px;
  animation: spin 90s linear infinite;
}

.inner-orbit {
  transform-origin: 500px 500px;
  animation: spinRev 60s linear infinite;
}

.dash-run {
  animation: dashRun 6s linear infinite;
}

.ecosystem-center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  width: 27%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px dashed rgba(66, 217, 255, 0.35);
  border-radius: 50%;
  background: rgba(7, 24, 39, 0.86);
  backdrop-filter: blur(4px);
  text-align: center;
}

.ecosystem-center span {
  color: #fff;
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(12px, 1.7vw, 16px);
  font-weight: 700;
  letter-spacing: 0.01em;
}

.ecosystem-center small {
  color: #42d9ff;
  font-family: "IBM Plex Mono", monospace;
  font-size: clamp(8.5px, 1.1vw, 10.5px);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ecosystem-satellite {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 6px 12px;
  border: 1px solid;
  border-radius: 100px;
  background: rgba(7, 24, 39, 0.92);
  color: #fff;
  font-size: 11.5px;
  white-space: nowrap;
  animation: popIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.ecosystem-node {
  position: absolute;
  width: 23%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 1px solid;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  text-align: center;
  transition: 0.25s;
}

.ecosystem-node span {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(13px, 1.8vw, 16px);
  font-weight: 600;
}

.ecosystem-node small {
  font-family: "IBM Plex Mono", monospace;
  font-size: clamp(9px, 1.1vw, 11px);
}

.ecosystem-detail {
  flex: 1 1 380px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.force-label {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.force-line {
  height: 1px;
  flex: 1;
  min-width: 40px;
  background: rgba(255, 255, 255, 0.14);
}

.ecosystem-detail h3 {
  margin: 0;
  color: #fff;
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(26px, 3.4vw, 38px);
  font-weight: 600;
  line-height: 1.06;
  letter-spacing: -0.02em;
}

.ecosystem-detail p {
  margin: 14px 0 0;
  color: #afc2d6;
  font-size: 16px;
  line-height: 1.6;
  text-wrap: pretty;
}

.force-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.force-chips span {
  padding: 7px 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.04);
  color: #c7d6e5;
  font-size: 12px;
}

.force-exchange {
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
}

.force-exchange > div {
  flex: 1 1 150px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 20px;
  background: #071827;
}

.force-exchange span {
  color: #7a93aa;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.force-exchange strong {
  color: #fff;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.45;
}

.force-live {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 20px;
  border: 1px solid;
  border-radius: 14px;
}

.force-live > span {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.force-live p {
  margin: 0;
  color: #c7d6e5;
  font-size: 15px;
  line-height: 1.55;
}

.force-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.force-actions a {
  padding: 14px 26px;
  border: 1px solid #2f6bff;
  border-radius: 100px;
  background: #2f6bff;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  transition: 0.25s;
}

.force-actions a:hover {
  color: #fff;
  box-shadow: 0 10px 30px -10px rgba(47, 107, 255, 0.6);
}

.force-actions button {
  padding: 13px 22px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  background: none;
  color: #afc2d6;
  cursor: pointer;
  font-size: 14.5px;
  transition: 0.2s;
}

.force-actions button:hover {
  border-color: #fff;
  color: #fff;
}

.ecosystem-loop {
  margin-top: clamp(40px, 6vw, 72px);
  padding-top: 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.loop-section-label {
  color: #7a93aa;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.loop-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  margin-top: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
}

.loop-steps button {
  flex: 1 1 190px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px 20px;
  border: none;
  color: #fff;
  cursor: pointer;
  text-align: left;
  transition: 0.25s;
}

.loop-steps button > span {
  font-family: "IBM Plex Mono", monospace;
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.loop-steps button b {
  color: #5b7690;
}

.loop-steps strong {
  color: #fff;
  font-family: "Space Grotesk", sans-serif;
  font-size: 16.5px;
  font-weight: 600;
  line-height: 1.3;
}

.loop-steps small {
  color: #7a93aa;
  font-size: 13px;
  line-height: 1.5;
}

.ecosystem-ticker {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 22px;
  padding: 14px 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.03);
}

.ticker-dot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #b7e36b;
  animation: haloPulse 2s ease-in-out infinite;
}

.ticker-label {
  color: #7a93aa;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.ticker-text {
  flex: 1 1 260px;
  color: #c7d6e5;
  font-size: 14px;
  line-height: 1.5;
  animation: fadeUp 0.5s both;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spinRev {
  to {
    transform: rotate(-360deg);
  }
}

@keyframes dashRun {
  to {
    stroke-dashoffset: -240;
  }
}

@keyframes haloPulse {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.12);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.82);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ecosystem *,
  .ecosystem *::before,
  .ecosystem *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}

@media (max-width: 900px) {
  .ecosystem-main {
    align-items: stretch;
  }

  .ecosystem-diagram {
    max-width: 600px;
    width: 100%;
  }

  .ecosystem-detail {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .ecosystem {
    padding: 64px 18px;
  }

  .ecosystem-header {
    gap: 24px;
  }

  .ecosystem-intro h2 {
    font-size: clamp(30px, 9vw, 42px);
  }

  .ecosystem-intro p {
    font-size: 15px;
  }

  .ecosystem-diagram {
    min-width: 0;
  }

  .ecosystem-satellite {
    padding: 5px 8px;
    font-size: 8px;
  }

  .ecosystem-node {
    width: 24%;
  }

  .ecosystem-node span {
    font-size: 10px;
  }

  .ecosystem-node small {
    font-size: 8px;
  }

  .ecosystem-center span {
    font-size: 10px;
  }

  .ecosystem-center small {
    font-size: 7px;
  }

  .force-actions a,
  .force-actions button {
    width: 100%;
    text-align: center;
  }

  .ecosystem-ticker {
    border-radius: 18px;
  }
}

`;

export default function Ecosystem() {
  const [activeKey, setActiveKey] = useState<NodeKey>("people");
  const [auto, setAuto] = useState(true);
  const [tick, setTick] = useState(0);

  const active = DATA[activeKey];
  const activeIndex = ORDER.indexOf(activeKey);
  const previousKey = ORDER[(activeIndex + ORDER.length - 1) % ORDER.length];
  const nextKey = ORDER[(activeIndex + 1) % ORDER.length];

  useEffect(() => {
    if (!auto) return;

    const timer = window.setInterval(() => {
      setActiveKey((current) => {
        const index = ORDER.indexOf(current);
        return ORDER[(index + 1) % ORDER.length];
      });
      setTick((current) => current + 1);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [auto]);

  const selectForce = (key: NodeKey) => {
    setActiveKey(key);
    setAuto(false);
  };

  const nextForce = () => selectForce(nextKey);

  const activePaths = useMemo(() => {
    const center: [number, number] = [500, 500];

    const segment = (a: [number, number], b: [number, number]) =>
      `M${a[0]},${a[1]} L${b[0]},${b[1]}`;

    return [
      {
        d: segment(POINTS[activeKey], center),
        color: hexToRgba(active.color, 0.55),
      },
      {
        d: segment(POINTS[previousKey], POINTS[activeKey]),
        color: hexToRgba(DATA[previousKey].color, 0.8),
      },
      {
        d: segment(POINTS[activeKey], POINTS[nextKey]),
        color: hexToRgba(active.color, 0.9),
      },
    ];
  }, [activeKey, active.color, nextKey, previousKey]);

  return (
    <>
      <style jsx global>{ecosystemStyles}</style>
      <section className="ecosystem">
      <div className="ecosystem-glow" />

      <div className="ecosystem-wrap">
        <div className="ecosystem-header">
          <div className="ecosystem-intro">
            <span className="ecosystem-eyebrow">The Impact Ecosystem</span>

            <h2>
              Five forces. One system,
              <br />
              and it never sits still.
            </h2>

            <p>
              Impact doesn&apos;t move in a straight line. It circulates —
              conviction becomes mandate, mandate attracts capital, capital
              proves solutions, evidence shifts influence, and influence
              changes what people can do next. Pick a force, or watch the loop
              run.
            </p>
          </div>

          <div className="ecosystem-loop-control">
            <button
              type="button"
              className={`loop-button ${auto ? "running" : "paused"}`}
              onClick={() => setAuto((current) => !current)}
            >
              <span className="loop-dot" />
              {auto ? "Loop running" : "Loop paused"}
            </button>

            <span className="loop-hint">
              {auto
                ? "Cycling every force. Click or hover to take over."
                : "You’re steering. Click to resume the loop."}
            </span>
          </div>
        </div>

        <div className="ecosystem-main">
          <div className="ecosystem-diagram">
            <svg
              className="ecosystem-svg"
              viewBox="0 0 1000 1000"
              aria-hidden="true"
            >
              <g className="outer-orbit">
                <circle
                  cx="500"
                  cy="500"
                  r="455"
                  fill="none"
                  stroke="rgba(255,255,255,.07)"
                  strokeWidth="1"
                  strokeDasharray="2 12"
                />
              </g>

              <g className="inner-orbit">
                <circle
                  cx="500"
                  cy="500"
                  r="330"
                  fill="none"
                  stroke="rgba(255,255,255,.06)"
                  strokeWidth="1"
                  strokeDasharray="1 9"
                />
              </g>

              {Object.entries(POINTS).map(([key, [x, y]]) => (
                <line
                  key={key}
                  x1="500"
                  y1="500"
                  x2={x}
                  y2={y}
                  stroke="rgba(255,255,255,.1)"
                  strokeWidth="1"
                />
              ))}

              <path
                d="M500,120 L861,383 L723,807 L277,807 L139,383 Z"
                fill="none"
                stroke="rgba(255,255,255,.16)"
                strokeWidth="1.2"
              />

              <path
                d="M500,120 L861,383 L723,807 L277,807 L139,383 Z"
                fill="none"
                stroke="rgba(66,217,255,.5)"
                strokeWidth="1.6"
                strokeDasharray="14 226"
                className="dash-run"
              />

              {activePaths.map((path, index) => (
                <path
                  key={index}
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              ))}

              {[
                ["#42D9FF", "0s"],
                ["#2F6BFF", "-3.6s"],
                ["#B7E36B", "-7.2s"],
                ["#FF6B5E", "-10.8s"],
                ["#F4A259", "-14.4s"],
              ].map(([color, delay], index) => (
                <circle key={index} r={index === 0 ? 5 : 4} fill={color}>
                  <animateMotion
                    dur="18s"
                    begin={delay}
                    repeatCount="indefinite"
                    path="M500,120 L861,383 L723,807 L277,807 L139,383 Z"
                  />
                </circle>
              ))}
            </svg>

            <div className="ecosystem-center">
              <span>AmplifImpact</span>
              <small>{auto ? "the broker" : `brokering ${activeKey}`}</small>
            </div>

            {active.chips.map((chip, index) => {
              const middle = (active.chips.length - 1) / 2;
              const offset = (index - middle) * 34;
              const angle =
                (ANGLES[activeKey] + offset) * (Math.PI / 180);
              const radius = 50 + (index % 2 === 0 ? 0 : 8);

              return (
                <span
                  key={chip}
                  className="ecosystem-satellite"
                  style={{
                    left: `${50 + radius * Math.cos(angle)}%`,
                    top: `${50 + radius * Math.sin(angle)}%`,
                    borderColor: hexToRgba(active.color, 0.5),
                  }}
                >
                  {chip}
                </span>
              );
            })}

            {ORDER.map((key) => {
              const force = DATA[key];
              const isActive = key === activeKey;
              const [left, top] = POINTS[key];

              return (
                <button
                  key={key}
                  type="button"
                  className={`ecosystem-node ${
                    isActive ? "active" : ""
                  }`}
                  style={{
                    left: `${(left / 10).toFixed(1)}%`,
                    top: `${(top / 10).toFixed(1)}%`,
                    background: isActive
                      ? hexToRgba(force.color, 0.18)
                      : "rgba(255,255,255,.045)",
                    borderColor: isActive
                      ? force.color
                      : "rgba(255,255,255,.2)",
                    boxShadow: isActive
                      ? `0 0 0 6px ${hexToRgba(
                          force.color,
                          0.08
                        )}, 0 14px 40px -14px ${hexToRgba(
                          force.color,
                          0.7
                        )}`
                      : "none",
                  }}
                  onClick={() => selectForce(key)}
                  onMouseEnter={() => selectForce(key)}
                >
                  <span>{forceName(key)}</span>
                  {/* <small
                    style={{
                      color: isActive ? force.color : "#7A93AA",
                    }}
                  >
                    {force.count}
                  </small> */}
                </button>
              );
            })}
          </div>

          <div className="ecosystem-detail">
            <div className="force-label">
              <span style={{ color: active.color }}>
                Force {String(activeIndex + 1).padStart(2, "0")} of 05
              </span>
              <span className="force-line" />
            </div>

            <div>
              <h3>{active.title}</h3>
              <p>{active.desc}</p>
            </div>

            <div className="force-chips">
              {active.chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>

            <div className="force-exchange">
              <div>
                <span>Puts in</span>
                <strong>{active.gives}</strong>
              </div>

              <div>
                <span>Needs back</span>
                <strong>{active.needs}</strong>
              </div>
            </div>

            <div
              className="force-live"
              style={{
                borderColor: hexToRgba(active.color, 0.28),
                background: hexToRgba(active.color, 0.07),
              }}
            >
              <span style={{ color: active.color }}>
                Live in the network
              </span>
              <p>{active.live}</p>
            </div>

            <div className="force-actions">
              <a href="#join">{active.cta}</a>

              <button type="button" onClick={nextForce}>
                Next force →
              </button>
            </div>
          </div>
        </div>

        <div className="ecosystem-loop">
          <span className="loop-section-label">The loop, in five moves</span>

          <div className="loop-steps">
            {LOOP.map((step) => {
              const isActive = step.key === activeKey;

              return (
                <button
                  key={step.key}
                  type="button"
                  className={isActive ? "active" : ""}
                  style={{
                    background: isActive
                      ? hexToRgba(DATA[step.key].color, 0.12)
                      : "#071827",
                  }}
                  onClick={() => selectForce(step.key)}
                  onMouseEnter={() => selectForce(step.key)}
                >
                  <span style={{ color: isActive ? DATA[step.key].color : "#7A93AA" }}>
                    {step.from} <b>→</b> {step.to}
                  </span>
                  <strong>{step.move}</strong>
                  <small>{step.detail}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="ecosystem-ticker">
          <span className="ticker-dot" />
          <span className="ticker-label">Moving now</span>
          <span className="ticker-text" key={tick}>
            {TICKER[tick % TICKER.length]}
          </span>
        </div>
      </div>
      </section>
    </>
  );
}

function forceName(key: NodeKey) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}
