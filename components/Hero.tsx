"use client";

import { useEffect, useRef, useState } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

const LABELS = [
  "NGOs",
  "CSR",
  "Government",
  "Philanthropy",
  "Academia",
  "Social Enterprise",
  "GCCs",
  "Technology",
  "Communities",
];

type Node = {
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useMagnetic(heroRef);

  // Hero content fades in shortly after mount, same as the original site.
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Constellation canvas animation.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = 0,
      h = 0,
      dpr = 1;
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;

    function initNodes() {
      const leftLabels = LABELS.slice(0, Math.ceil(LABELS.length / 2));
      const rightLabels = LABELS.slice(Math.ceil(LABELS.length / 2));

      const createNode = (
        label: string,
        index: number,
        side: "left" | "right"
      ): Node => {
        const zoneStart = side === "left" ? 40 : w * 0.75;
        const zoneEnd = side === "left" ? w * 0.25 : w - 40;

        return {
          label,
          x: zoneStart + Math.random() * (zoneEnd - zoneStart),
          y: 50 + Math.random() * Math.max(1, h - 100),
          vx: (Math.random() - 0.5) * 0.14,
          vy: (Math.random() - 0.5) * 0.14,
          r: 3 + (index % 3),
        };
      };

      nodes = [
        ...leftLabels.map((label, i) => createNode(label, i, "left")),
        ...rightLabels.map((label, i) => createNode(label, i, "right")),
      ];
    }

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    }

    function drawFrame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 260) {
            ctx.strokeStyle = `rgba(66,217,255,${0.16 * (1 - d / 260)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(66,217,255,0.9)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 7, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(66,217,255,0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.font = "11px IBM Plex Mono, monospace";
        ctx.fillStyle = "rgba(199,214,229,0.75)";
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y - 16);
      });
    }

    function step() {
      const leftStart = 40;
      const leftEnd = w * 0.25;

      const rightStart = w * 0.75;
      const rightEnd = w - 40;

      nodes.forEach((n) => {
        const isLeftNode = n.x < w * 0.5;

        const minX = isLeftNode ? leftStart : rightStart;
        const maxX = isLeftNode ? leftEnd : rightEnd;

        // Move
        n.x += n.vx;
        n.y += n.vy;

        // Horizontal boundaries
        if (n.x <= minX) {
          n.x = minX;
          n.vx = Math.abs(n.vx);
        }

        if (n.x >= maxX) {
          n.x = maxX;
          n.vx = -Math.abs(n.vx);
        }

        // Vertical boundaries
        if (n.y <= 40) {
          n.y = 40;
          n.vy = Math.abs(n.vy);
        }

        if (n.y >= h - 40) {
          n.y = h - 40;
          n.vy = -Math.abs(n.vy);
        }

        // Mouse interaction
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160) {
          const pushX = n.x - dx * 0.0025;
          const pushY = n.y - dy * 0.0025;

          // Keep mouse movement inside the node's own zone
          if (pushX >= minX && pushX <= maxX) {
            n.x = pushX;
          }

          if (pushY >= 40 && pushY <= h - 40) {
            n.y = pushY;
          }
        }
      });

      drawFrame();
      raf = requestAnimationFrame(step);
    }

    const onResize = () => resize();
    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    resize();
    if (prefersReducedMotion) {
      nodes.forEach((n) => {
        n.vx = 0;
        n.vy = 0;
      });
      drawFrame();
    } else {
      step();
    }

    return () => {
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const revealClass = (extra = "") =>
    `reveal${revealed ? " in" : ""}${extra ? " " + extra : ""}`;

  return (
    <header className="hero" id="top" ref={heroRef}>
      <canvas id="constellation" aria-hidden="true" ref={canvasRef} />
      <div className="hero-content">
        {/* <p className={revealClass("hero-kicker")}>
          A Social Impact Intelligence, Convening &amp; Amplification
          Platform
        </p> */}
        <h1 className={revealClass("hero-headline")}>
          Where Impact
          <br />
          Meets <em>Influence.</em>
        </h1>
        <p className={revealClass("hero-sub")}>
          AmplifImpact connects the people, organisations, ideas and
          institutions shaping a more inclusive and sustainable future.
        </p>
        <p className={revealClass("hero-loop")}>
          Discover<span className="dot">·</span>Connect
          <span className="dot">·</span>Amplify<span className="dot">·</span>
          Act
        </p>
        <div className={revealClass("hero-ctas")}>
          <a href="#ecosystem" className="btn-primary magnetic">
            Explore the Impact Ecosystem
          </a>
          <a href="#join" className="btn-ghost-light magnetic">
            Join the Network
          </a>
        </div>
      </div>
      {/* <div className="hero-scroll-hint" aria-hidden="true">
        <span />
        Scroll
      </div> */}
    </header>
  );
}
