"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["influence.", "capital.", "policy.", "scale.", "influence."];

const SIGNALS = [
  {
    tag: "Capital",
    text: "A climate fund shortlisted four cool-roof models for a second city.",
    tagColor: "#B7E36B",
  },
  {
    tag: "Policy",
    text: "Evaluation data from three states entered a national skilling consultation.",
    tagColor: "#F4A259",
  },
  {
    tag: "Partnership",
    text: "Two corporates pooled CSR budgets behind one water programme.",
    tagColor: "#2F6BFF",
  },
  {
    tag: "Solution",
    text: "A district nutrition pilot published its replication pack — 168 now ready.",
    tagColor: "#FF6B5E",
  },
  {
    tag: "Forum",
    text: "Climate Resilience Forum, Nairobi — delegate list opens this month.",
    tagColor: "#42D9FF",
  },
];

type Point = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  d: number;
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [noWordAnimation, setNoWordAnimation] = useState(false);

  useEffect(() => {
    const period = 2600;

    const interval = window.setInterval(() => {
      setWordIndex((current) => {
        if (current >= WORDS.length - 1) {
          window.setTimeout(() => {
            setNoWordAnimation(true);
            setWordIndex(0);

            window.setTimeout(() => {
              setNoWordAnimation(false);
            }, 40);
          }, 720);

          return WORDS.length - 1;
        }

        return current + 1;
      });
    }, period);

    const start = performance.now();
    let animationFrame = 0;

    const animateProgress = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      const eased = 1 - Math.pow(1 - p, 3);

      setProgress(eased);

      if (p < 1) {
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };

    animationFrame = requestAnimationFrame(animateProgress);

    return () => {
      window.clearInterval(interval);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let points: Point[] = [];
    let raf = 0;

    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const density = 64;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(
        26,
        Math.round(
          density * Math.min(1.4, (width * height) / 900000)
        )
      );

      points = new Array(count).fill(null).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.7 + 0.7,
        d: Math.random() * 0.7 + 0.3,
      }));
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetMouseX = event.clientX / window.innerWidth;
      targetMouseY = event.clientY / window.innerHeight;
    };

    const draw = () => {
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const parallaxX = (mouseX - 0.5) * 26;
      const parallaxY = (mouseY - 0.5) * 26;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < points.length; i++) {
        const point = points[i];

        if (!reducedMotion) {
          point.x += point.vx;
          point.y += point.vy;

          if (point.x < -20) point.x = width + 20;
          if (point.x > width + 20) point.x = -20;

          if (point.y < -20) point.y = height + 20;
          if (point.y > height + 20) point.y = -20;
        }

        for (let j = i + 1; j < points.length; j++) {
          const other = points[j];

          const dx = point.x - other.x;
          const dy = point.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(120,170,220,${
              0.16 * (1 - distance / 150)
            })`;

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(
              point.x + parallaxX * point.d,
              point.y + parallaxY * point.d
            );
            ctx.lineTo(
              other.x + parallaxX * other.d,
              other.y + parallaxY * other.d
            );
            ctx.stroke();
          }
        }
      }

      for (const point of points) {
        ctx.fillStyle = `rgba(180,215,245,${
          0.28 + point.d * 0.3
        })`;

        ctx.beginPath();
        ctx.arc(
          point.x + parallaxX * point.d,
          point.y + parallaxY * point.d,
          point.r,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      if (!reducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const number = (value: number) =>
    Math.round(value * progress).toLocaleString("en-US");

  return (
    <>
      <header className="hero" id="top" >
        <canvas
          ref={canvasRef}
          className="hero-canvas"
          aria-hidden="true"
        />

        <div className="hero-glow hero-glow-blue" aria-hidden="true" />
        <div className="hero-glow hero-glow-cyan" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />



        <div className="hero-main">
          <div className="hero-layout">
            <div className="hero-copy">
              {/* <div className="hero-live-pill">
                <span className="hero-live-dot" />
                <span>Live · {number(11400)} members · 41 countries</span>
              </div> */}

              <h1 className="hero-title">
                <span className="hero-title-line">Where impact</span>

                <span className="hero-title-second-line">
                  <span>meets</span>

                  <span className="hero-word-window">
                    <span
                      className={`hero-word-stack ${
                        noWordAnimation ? "no-transition" : ""
                      }`}
                      style={{
                        transform: `translateY(-${
                          wordIndex * 1.16
                        }em)`,
                      }}
                    >
                      {WORDS.map((word, index) => (
                        <span
                          key={`${word}-${index}`}
                          className={`hero-word hero-word-${index}`}
                        >
                          {word}
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
              </h1>

              <p className="hero-description">
                The people, organisations, ideas and institutions shaping
                a more inclusive future are already doing the work. We
                close the distance between them so evidence travels,
                capital finds the right hands, and good models stop
                stopping at the district line.
              </p>

              <div className="hero-actions">
                <a href="#ecosystem" className="hero-primary magnetic">
                  Explore the Impact Ecosystem
                  <span>→</span>
                </a>

                <a href="#join" className="hero-secondary magnetic">
                  Join the Network
                </a>
              </div>

              <p className="hero-loop">
                <span>Discover</span>
                <b>·</b>
                <span>Connect</span>
                <b>·</b>
                <span>Amplify</span>
                <b>·</b>
                <span>Act</span>
              </p>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span>Organisations indexed</span>
                <strong>{number(222)}</strong>
              </div>

              <div className="hero-stat">
                <span>Solutions with evidence</span>
                <strong className="cyan">{number(132)}</strong>
              </div>

              <div className="hero-stat">
                <span>Capital tracked</span>
                <strong className="green">
                  ₹{Math.round(480 * progress)}K
                </strong>
              </div>

              <div className="hero-stat">
                <span>Policy citations traced</span>
                <strong className="orange">{number(6)}</strong>
              </div>

              <span className="hero-stat-bottom-line" />

              <a href="#index-section" className="hero-index-link">
                See the live index →
              </a>
            </div>
          </div>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span />
        </div>

        <div className="hero-signals">
          <div className="hero-moving">
            <span className="hero-moving-dot" />
            Moving now
          </div>

          <div className="hero-marquee-wrapper">
            <div className="hero-marquee">
              {[...SIGNALS, ...SIGNALS].map((signal, index) => (
                <span className="hero-signal" key={`${signal.tag}-${index}`}>
                  <span
                    className="hero-signal-tag"
                    style={{ color: signal.tagColor }}
                  >
                    {signal.tag}
                  </span>

                  <span>{signal.text}</span>

                  <span className="hero-signal-divider">/</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          background: #102a43;
          color: #ffffff;
          font-family: "Inter", sans-serif;
          overflow: hidden;
          isolation: isolate;
        }

        .hero :global(a) {
          text-decoration: none;
        }

        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .hero-glow {
          position: absolute;
          pointer-events: none;
          z-index: 1;
          border-radius: 50%;
        }

        .hero-glow-blue {
          top: -30%;
          left: 58%;
          width: min(1000px, 110vw);
          aspect-ratio: 1;
          background: radial-gradient(
            circle,
            rgba(47, 107, 255, 0.32),
            transparent 62%
          );
          filter: blur(10px);
        }

        .hero-glow-cyan {
          bottom: -20%;
          left: -10%;
          width: min(720px, 90vw);
          aspect-ratio: 1;
          background: radial-gradient(
            circle,
            rgba(66, 217, 255, 0.14),
            transparent 65%
          );
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(7, 24, 39, 0.55),
            rgba(16, 42, 67, 0) 32%,
            rgba(7, 24, 39, 0.72)
          );
        }

        .hero-main {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
          padding: clamp(40px, 6vw, 80px)
          max-width: 1440px;
          width: 100%;
          margin: 0 auto;
        }

        .hero-layout {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(32px, 5vw, 72px);
          align-items: flex-end;
          width: 100%;
        }

        .hero-copy {
          flex: 1 1 620px;
          min-width: 290px;
          max-width: 920px;
        }

        .hero-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 7px 16px 7px 12px;
          border-radius: 100px;
          border: 1px solid rgba(66, 217, 255, 0.32);
          background: rgba(66, 217, 255, 0.08);
          animation: heroRiseIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .hero-live-pill span:last-child {
          font-family: "IBM Plex Mono", monospace;
          font-size: 11.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #42d9ff;
        }

        .hero-live-dot,
        .hero-moving-dot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #42d9ff;
          animation: heroPulseDot 2.2s ease-in-out infinite;
        }

        .hero-title {
          font-family: "Space Grotesk", sans-serif;
          font-weight: 600;
          font-size: clamp(44px, 8.4vw, 108px);
          line-height: 1;
          letter-spacing: -0.035em;
          color: #ffffff;
          margin: clamp(20px, 3vw, 32px) 0 0;
          animation: heroRiseIn 0.8s 0.08s
            cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .hero-title-line {
          display: block;
        }

        .hero-title-second-line {
          display: flex;
          align-items: baseline;
          gap: 0.28em;
          flex-wrap: wrap;
        }

        .hero-word-window {
          display: inline-block;
          height: 1.16em;
          overflow: hidden;
          vertical-align: bottom;
        }

        .hero-word-stack {
          display: flex;
          flex-direction: column;
          transition: transform 0.72s cubic-bezier(0.66, 0, 0.2, 1);
        }

        .hero-word-stack.no-transition {
          transition: none;
        }

        .hero-word {
          height: 1.16em;
          line-height: 1.16;
        }

        .hero-word-0,
        .hero-word-4 {
          color: #42d9ff;
        }

        .hero-word-1 {
          color: #b7e36b;
        }

        .hero-word-2 {
          color: #ff6b5e;
        }

        .hero-word-3 {
          color: #f4a259;
        }

        .hero-description {
          margin: clamp(20px, 3vw, 30px) 0 0;
          font-size: clamp(16px, 1.6vw, 20px);
          line-height: 1.55;
          color: #c7d6e5;
          max-width: 620px;
          text-wrap: pretty;
          animation: heroRiseIn 0.8s 0.16s
            cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: clamp(26px, 3.4vw, 38px);
          animation: heroRiseIn 0.8s 0.24s
            cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .hero-primary,
        .hero-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 15.5px;
          border-radius: 100px;
          transition:
            box-shadow 0.25s ease,
            transform 0.25s ease,
            background 0.25s ease,
            border-color 0.25s ease;
        }

        .hero-primary {
          background: #2F6BFF;
          padding: 16px 30px;
          border: 1px solid #2F6BFF;
        }

        .hero-primary:hover {
          box-shadow: 0 14px 40px -12px rgba(47, 107, 255, 0.75);
          transform: translateY(-1px);
        }

        .hero-primary span {
          font-family: "IBM Plex Mono", monospace;
          font-size: 14px;
        }

        .hero-secondary {
          color: #ffffff;
          padding: 16px 28px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .hero-secondary:hover {
          border-color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .hero-loop {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px;
          margin: clamp(24px, 3vw, 34px) 0 0;
          font-family: "IBM Plex Mono", monospace;
          font-size: 12.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7a93aa;
          animation: heroRiseIn 0.8s 0.3s
            cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .hero-loop span {
          color: #ffffff;
        }

        .hero-loop b {
          color: #ff6b5e;
          font-weight: 400;
        }

        .hero-stats {
          flex: 1 1 260px;
          min-width: 240px;
          display: flex;
          flex-direction: column;
          animation: heroRiseIn 0.9s 0.34s
            cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .hero-stat {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }

        .hero-stat span {
          font-size: 13.5px;
          line-height: 1.4;
          color: #afc2d6;
          max-width: 150px;
        }

        .hero-stat strong {
          font-family: "Space Grotesk", sans-serif;
          font-weight: 600;
          font-size: clamp(26px, 3vw, 38px);
          letter-spacing: -0.02em;
          color: #ffffff;
          font-variant-numeric: tabular-nums;
        }

        .hero-stat strong.cyan {
          color: #42d9ff;
        }

        .hero-stat strong.green {
          color: #b7e36b;
        }

        .hero-stat strong.orange {
          color: #f4a259;
        }

        .hero-stat-bottom-line {
          display: block;
          height: 1px;
          background: rgba(255, 255, 255, 0.14);
          transform-origin: left;
          animation: heroLineGrow 0.9s 0.5s
            cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .hero-index-link {
          font-family: "IBM Plex Mono", monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          color: #42d9ff;
          margin-top: 14px;
        }

        .hero-scroll {
          position: relative;
          z-index: 3;
          display: flex;
          justify-content: flex-end;
          padding: 0 clamp(20px, 5vw, 60px) 18px;
        }

        .hero-scroll span {
          width: 1px;
          height: 34px;
          background: linear-gradient(
            to bottom,
            rgba(122, 147, 170, 0),
            #7a93aa
          );
          animation: heroScrollHint 2.2s ease-in-out infinite;
        }

        .hero-signals {
          position: relative;
          z-index: 3;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(7, 24, 39, 0.5);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          gap: 0;
          overflow: hidden;
        }

        .hero-moving {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 14px clamp(16px, 3vw, 26px);
          border-right: 1px solid rgba(255, 255, 255, 0.12);
          font-family: "IBM Plex Mono", monospace;
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #b7e36b;
          background: rgba(7, 24, 39, 0.6);
        }

        .hero-moving-dot {
          background: #b7e36b;
          animation-duration: 2s;
        }

        .hero-marquee-wrapper {
          flex: 1;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(
            90deg,
            transparent,
            #000 4%,
            #000 92%,
            transparent
          );
        }

        .hero-marquee {
          display: flex;
          width: max-content;
          animation: heroMarquee 46s linear infinite;
        }

        .hero-signal {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 14px 26px;
          font-size: 13.5px;
          color: #c7d6e5;
          white-space: nowrap;
        }

        .hero-signal-tag {
          font-family: "IBM Plex Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .hero-signal-divider {
          color: #28455f;
        }

        @keyframes heroRiseIn {
          from {
            opacity: 0;
            transform: translateY(26px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes heroLineGrow {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes heroMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes heroPulseDot {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }

        @keyframes heroScrollHint {
          0%,
          100% {
            opacity: 0.25;
          }

          50% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero *,
          .hero *::before,
          .hero *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 900px) {
          .hero-main {
            align-items: flex-start;
          }

          .hero-layout {
            align-items: flex-start;
          }

          .hero-stats {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .hero {
            min-height: 100svh;
          }

          .hero-main {
            padding-top: 42px;
          }

          .hero-title {
            font-size: clamp(43px, 14vw, 72px);
          }

          .hero-description {
            font-size: 16px;
          }

          .hero-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .hero-primary,
          .hero-secondary {
            justify-content: center;
            width: 100%;
          }

          .hero-stats {
            width: 100%;
          }

          .hero-stat strong {
            font-size: 28px;
          }

          .hero-moving {
            padding-left: 16px;
            padding-right: 16px;
          }

          .hero-signal {
            padding-left: 18px;
            padding-right: 18px;
          }
        }
      `}</style>
    </>
  );
}
