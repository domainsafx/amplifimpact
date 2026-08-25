"use client";

import { useEffect, type RefObject } from "react";

/**
 * Fades/slides in any descendant of `containerRef` carrying the
 * `.reveal` or `.reveal-line` class as it scrolls into view, by
 * toggling the `.in` class (see globals.css for the transition).
 */
export function useReveal(containerRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = container.querySelectorAll(".reveal, .reveal-line");
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [containerRef]);
}
