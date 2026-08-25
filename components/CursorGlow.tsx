"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let gx = 0,
      gy = 0,
      cx = 0,
      cy = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      gx = e.clientX;
      gy = e.clientY;
      glow.style.opacity = "1";
    };
    const onLeave = () => {
      glow.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    function animGlow() {
      if (!glow) return;
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(animGlow);
    }
    if (!prefersReducedMotion) raf = requestAnimationFrame(animGlow);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cursor-glow" ref={glowRef} aria-hidden="true" />;
}
