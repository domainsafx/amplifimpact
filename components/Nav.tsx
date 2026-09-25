"use client";

import { useEffect, useRef, useState } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

const LINKS = [
  { href: "#ecosystem", label: "Ecosystem" },
  // { href: "#intelligence", label: "Intelligence" },
  { href: "#forums", label: "Forums" },
  { href: "#how-work", label: "Advisory" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useMagnetic(navRef);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`nav${scrolled ? " scrolled" : ""}`}
      id="nav"
      ref={navRef}
    >
      <div className="nav-inner">
        <a href="#top" className="nav-logo">
          AMPLIFIMPACT
        </a>
        <div className="nav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <a href="#join" className="btn-nav magnetic">
          Join Network
        </a>
        <button
          className="nav-toggle"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
        </button>
      </div>
      <div className={`nav-mobile${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a
          href="#join"
          className="btn-nav"
          style={{ marginTop: 16, display: "inline-block" }}
          onClick={() => setOpen(false)}
        >
          Join Network
        </a>
      </div>
    </nav>
  );
}
