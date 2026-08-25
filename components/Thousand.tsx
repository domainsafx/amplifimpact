"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

type Profile = { name: string; cat: string; loc: string; desc: string };

const PROFILES: Profile[] = [
  {
    name: "Good Universe",
    cat: "NGOs",
    loc: "Hyderabad, IN",
    desc: "Health, livelihoods & climate resilience across 3 states",
  },
  {
    name: "Uday Aqua Connects",
    cat: "Social Enterprise",
    loc: "Hyderabad, IN",
    desc: "Circulatory aquaculture technology & farmer networks",
  },
  {
    name: "Aanya Krishnan",
    cat: "People",
    loc: "Bengaluru, IN",
    desc: "Maternal health systems designer, 12 years field experience",
  },
  {
    name: "BGSW CSR",
    cat: "CSR",
    loc: "Bengaluru, IN",
    desc: "Industry 4.0 skilling & engineer mentorship at scale",
  },
  {
    name: "Telangana Horticulture Mission",
    cat: "Government",
    loc: "Hyderabad, IN",
    desc: "MIDH implementation, mushroom & moringa value chains",
  },
  {
    name: "IIT Palakkad Ecology Lab",
    cat: "Academia",
    loc: "Palakkad, IN",
    desc: "Urban forest carbon sequestration research",
  },
  {
    name: "National Bee Board",
    cat: "Government",
    loc: "New Delhi, IN",
    desc: "Sweet Revolution beekeeping livelihoods mission",
  },
  {
    name: "David Mwangi",
    cat: "People",
    loc: "Nairobi, KE",
    desc: "Climate adaptation finance, parametric insurance design",
  },
  {
    name: "ATREE Bengaluru",
    cat: "Academia",
    loc: "Bengaluru, IN",
    desc: "Miyawaki forest carbon research, peer-reviewed",
  },
  {
    name: "Ramky Foundation",
    cat: "Philanthropy",
    loc: "Hyderabad, IN",
    desc: "CSR partner, aquaculture & rural livelihoods",
  },
  {
    name: "PurAID Global",
    cat: "Social Enterprise",
    loc: "Amsterdam, NL",
    desc: "Point-of-use water technology, sub-€25/capita",
  },
  {
    name: "Fatima Osei",
    cat: "People",
    loc: "Accra, GH",
    desc: "Beekeeping & apiculture livelihoods, women-led collectives",
  },
  {
    name: "Climate Insurance Collective",
    cat: "Climate",
    loc: "Multi-region",
    desc: "SEWA/Blue Marble-style parametric heat protection",
  },
  {
    name: "ICAR-CARI",
    cat: "Academia",
    loc: "Izatnagar, IN",
    desc: "National avian & quail research institute",
  },
  {
    name: "Chennai Health Access Lab",
    cat: "Health",
    loc: "Chennai, IN",
    desc: "Adolescent anaemia intervention research",
  },
  {
    name: "EdBridge Foundation",
    cat: "Education",
    loc: "Mumbai, IN",
    desc: "First-generation learner scholarship network",
  },
];

const FILTERS = [
  "all",
  "People",
  "NGOs",
  "CSR",
  "Government",
  "Academia",
  "Philanthropy",
  "Social Enterprise",
  "Climate",
  "Health",
  "Education",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Thousand() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("all");
  const [count, setCount] = useState(0);
  useReveal(sectionRef);

  const list = useMemo(
    () => PROFILES.filter((p) => filter === "all" || p.cat === filter),
    [filter]
  );

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    let counted = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !counted) {
            counted = true;
            const target = 1000;
            const dur = 1400;
            const t0 = performance.now();
            function tick(t: number) {
              const p = Math.min(1, (t - t0) / dur);
              setCount(Math.floor(p * target));
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="thousand" id="thousand" ref={sectionRef}>
      <div className="wrap">
        <div className="thousand-head">
          <div className="thousand-num" id="thousandCounter" ref={counterRef}>
            {count.toLocaleString()}
          </div>
          <div className="thousand-copy">
            <p className="section-lede">
              People. Organisations. Solutions. Changing the world indexed,
              verified, and searchable in one place.
            </p>
          </div>
        </div>
        <div className="filter-row" id="filterRow">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter${filter === f ? " active" : ""}`}
              data-f={f}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
        <div className="profile-list" id="profileList">
          {list.map((p) => (
            <div className="profile-row" key={p.name}>
              <div className="profile-avatar">{initials(p.name)}</div>
              <h4>{p.name}</h4>
              <span className="profile-cat">{p.cat}</span>
              <span className="profile-desc">{p.desc}</span>
              <span className="profile-loc">{p.loc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
