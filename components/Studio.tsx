"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

const FEATURE = {
  img: "studio-img--1",
  cat: "Field Notes",
  title: "Inside a 3-day toilet build: what it actually takes to close a WASH gap",
  date: "12 Aug 2027",
  read: "7 min read",
};

const CARDS = [
  {
    img: "studio-img--2",
    cat: "Impact Leaders",
    title:
      "The technologist who built a climate-health insurance product from a spreadsheet",
    date: "03 Aug 2027",
    read: "5 min read",
  },
  {
    img: "studio-img--3",
    cat: "What Works",
    title: "Why cluster size, not funding size, predicts skilling-programme survival",
    date: "28 Jul 2027",
    read: "6 min read",
  },
  {
    img: "studio-img--4",
    cat: "Data Stories",
    title: "Mapping India's anaemia crisis against its aquaculture belt",
    date: "19 Jul 2027",
    read: "4 min read",
  },
  {
    img: "studio-img--5",
    cat: "Conversations",
    title: "Two funders on why they stopped asking for pitch decks",
    date: "08 Jul 2027",
    read: "9 min read",
  },
];

export default function Studio() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="studio" id="studio" ref={ref}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Impact Studio</span>
          <h2>Field notes from where the work happens.</h2>
        </div>
        <div className="studio-grid">
          <a href="#" className="studio-feature">
            <div className={`studio-img ${FEATURE.img}`} />
            <span className="studio-cat">{FEATURE.cat}</span>
            <h3>{FEATURE.title}</h3>
            <div className="studio-meta">
              <span>{FEATURE.date}</span>
              <span>·</span>
              <span>{FEATURE.read}</span>
            </div>
          </a>
          {CARDS.map((c) => (
            <a href="#" className="studio-card" key={c.title}>
              <div className={`studio-img ${c.img}`} />
              <span className="studio-cat">{c.cat}</span>
              <h3>{c.title}</h3>
              <div className="studio-meta">
                <span>{c.date}</span>
                <span>·</span>
                <span>{c.read}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
