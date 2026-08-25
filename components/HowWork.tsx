"use client";

import { useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const TABS = [
  { key: "discover", label: "Discover" },
  { key: "connect", label: "Connect" },
  { key: "amplify", label: "Amplify" },
  { key: "act", label: "Act" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const CARDS: Record<
  TabKey,
  { href: string; eyebrow: string; title: string; copy: string; link: string }[]
> = {
  discover: [
    {
      href: "#intelligence",
      eyebrow: "Impact Intelligence",
      title: "Search the index",
      copy: "A live index of organisations, evidence and partnership opportunities searchable, not just browsable.",
      link: "Explore Intelligence →",
    },
    {
      href: "#thousand",
      eyebrow: "AmplifImpact 1000",
      title: "Meet who's doing the work",
      copy: "People, organisations and solutions changing the world indexed, verified and filterable by sector.",
      link: "Browse the 1000 →",
    },
    {
      href: "#index-section",
      eyebrow: "Impact Index",
      title: "Benchmark performance",
      copy: "Seven indicators benchmarked across the AmplifImpact 1000, so you know who's actually moving the needle.",
      link: "View the Index →",
    },
  ],
  connect: [
    {
      href: "#ecosystem",
      eyebrow: "Impact Ecosystem",
      title: "Map the relationships",
      copy: "Five forces people, institutions, capital, solutions, influence and how they move together.",
      link: "See the Ecosystem →",
    },
    {
      href: "#forums",
      eyebrow: "Forums",
      title: "Meet in the room",
      copy: "Convenings that turn index entries and search results into real relationships, in person and online.",
      link: "See upcoming Forums →",
    },
    {
      href: "#global",
      eyebrow: "Global Network",
      title: "Reach across borders",
      copy: "Hubs across Asia, Africa, the Middle East and Europe, connected into one network.",
      link: "See the Network →",
    },
  ],
  amplify: [
    {
      href: "#amplification",
      eyebrow: "Amplification",
      title: "Go from story to influence",
      copy: "A 90-day journey from a good story to real influence not a press release, a pipeline.",
      link: "See the Journey →",
    },
    {
      href: "#studio",
      eyebrow: "Impact Studio",
      title: "Build the narrative",
      copy: "Editorial and production support to help proven work reach funders, policymakers and the public.",
      link: "Visit the Studio →",
    },
    {
      href: "#report",
      eyebrow: "State of Social Impact",
      title: "Read the annual signal",
      copy: "Our flagship report on where capital, policy and attention in the sector are actually heading.",
      link: "Read the Report →",
    },
  ],
  act: [
    {
      href: "#exchange",
      eyebrow: "Impact Exchange",
      title: "Turn challenges into pilots",
      copy: "From corporate challenge to scaled solution discovery, validation, connection, pilot, scale.",
      link: "Enter the Exchange →",
    },
    {
      href: "#policy",
      eyebrow: "Policy Lab",
      title: "Move it into policy",
      copy: "Evidence and briefings that help proven solutions influence regulation and public spending.",
      link: "Visit the Policy Lab →",
    },
    {
      href: "#fellows",
      eyebrow: "Fellows",
      title: "Back the people",
      copy: "A fellowship for practitioners turning insight into pilots, policy and scaled organisations.",
      link: "Meet the Fellows →",
    },
  ],
};

export default function HowWork() {
  const ref = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<TabKey>("discover");
  useReveal(ref);

  return (
    <section className="how-work" id="how-work" ref={ref}>
      <div className="wrap">
        <div className="section-head light">
          <span className="eyebrow light">How We Work</span>
          <h2>One platform, four ways in.</h2>
          <p className="section-lede light-sub">
            Every tool on AmplifImpact maps back to the model discover,
            connect, amplify, act. Pick a lane to see what&apos;s inside.
          </p>
        </div>
        <div className="how-work-tabs" id="howWorkTabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`pill-dark${tab === t.key ? " active" : ""}`}
              data-hw={t.key}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {TABS.map((t) => (
          <div
            key={t.key}
            className={`how-work-grid${tab === t.key ? " active" : ""}`}
            data-hwg={t.key}
          >
            {CARDS[t.key].map((c) => (
              <a key={c.title} href={c.href} className="hw-card">
                <span className="hw-eyebrow">{c.eyebrow}</span>
                <h3>{c.title}</h3>
                <p>{c.copy}</p>
                <span className="hw-link">{c.link}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
