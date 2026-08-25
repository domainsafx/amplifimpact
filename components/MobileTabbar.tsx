"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  {
    href: "#top",
    label: "Home",
    icon: (
      <path
        d="M4 11L12 4l8 7v8a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "#ecosystem",
    label: "Explore",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      </>
    ),
  },
  {
    href: "#thousand",
    label: "Network",
    icon: (
      <>
        <circle cx="8" cy="9" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16" cy="9" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M3 19c.5-3 2.3-4.6 5-4.6s4.5 1.6 5 4.6M11 19c.5-3 2.3-4.6 5-4.6s4.5 1.6 5 4.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    href: "#forums",
    label: "Events",
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M3.5 9.5h17M8 3v4M16 3v4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    href: "#join",
    label: "Join",
    icon: (
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ),
  },
];

const ANCHORS = ["#top", "#ecosystem", "#thousand", "#forums", "#join"];

export default function MobileTabbar() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY + 200;
      let idx = 0;
      ANCHORS.forEach((a, i) => {
        const el = document.querySelector<HTMLElement>(a);
        if (el && el.offsetTop <= y) idx = i;
      });
      setActiveIdx(idx);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="mobile-tabbar" aria-label="Primary">
      {ITEMS.map((item, i) => (
        <a
          key={item.href}
          href={item.href}
          className={`mt-item${i === activeIdx ? " active" : ""}`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            {item.icon}
          </svg>
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
