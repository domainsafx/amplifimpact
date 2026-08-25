"use client";

import { useEffect, type RefObject } from "react";

/**
 * Applies the subtle "magnetic" cursor-follow effect to any descendant
 * of `containerRef` carrying the `.magnetic` class.
 */
export function useMagnetic(containerRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = Array.from(
      container.querySelectorAll<HTMLElement>(".magnetic")
    );
    if (els.length === 0) return;

    const cleanups: Array<() => void> = [];

    els.forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${mx * 0.18}px, ${my * 0.3}px)`;
      };
      const onLeave = () => {
        el.style.transform = "translate(0,0)";
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [containerRef]);
}
