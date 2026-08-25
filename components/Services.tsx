"use client";

import { useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";

const SERVICES = [
  {
    num: "01",
    title: "Advisory & Strategy",
    desc: "Strategic review, landscape research, partnership development and evaluation support for the people and institutions deciding where and how to give.",
    audience: [
      "Individual philanthropists and family offices",
      "Foundations building or refreshing a giving strategy",
      "Institutions evaluating an existing portfolio",
    ],
    spotlight:
      "We paired a first-time funder with a landscape study drawn from the AmplifImpact 1000 and Index data turning three months of cold research into a two-week head start.",
  },
  {
    num: "02",
    title: "Market & Ecosystem Entry",
    desc: "Support for organisations launching new programming in a market they don't yet know introductions, regulatory context and a shortlist of the right local partners.",
    audience: [
      "NGOs and foundations entering a new geography",
      "Newly established local or regional entities",
      "Corporates building a CSR presence from scratch",
    ],
    spotlight:
      "An engagement strategy built through the Impact Ecosystem map took an NGO from zero local relationships to five active partnerships within a year.",
  },
  {
    num: "03",
    title: "Programme Design & Evaluation",
    desc: "Landscape studies, iterative programme design and implementation support benchmarked against the seven indicators behind the Impact Index.",
    audience: [
      "Early-stage initiatives needing strategy and delivery capacity",
      "Organisations seeking outside design or evaluation review",
    ],
    spotlight:
      "Working alongside a regional health alliance, we convened funders and designed a financing structure that closed a long-standing gap in the sector.",
  },
  {
    num: "04",
    title: "Capacity Building",
    desc: "Programme evaluation, strategic review, partnership development and fundraising support for organisations ready to grow their impact.",
    audience: [
      "Grant partners looking to strengthen governance and delivery",
      "Teams preparing for their next stage of funding",
    ],
    spotlight:
      "A deep-dive with a grantee organisation surfaced clear gaps in governance and business model and a practical roadmap toward sustainability.",
  },
  {
    num: "05",
    title: "Fractional Leadership",
    desc: "Embedded fractional support Executive Director, Head of Programmes or Secretariat for lean teams that need senior capacity without a full-time hire.",
    audience: [
      "Newly set up or lean foundations launching their first strategy",
      "Funders new to the region needing hands-on assistance",
      "New collaboratives needing someone to lead and convene",
    ],
    spotlight:
      "We stepped in as fractional programme lead for a new family foundation, designing their strategy and administering grants while they built out their in-house team.",
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useReveal(ref);
  useMagnetic(ref);

  return (
    <section className="services" id="services" ref={ref}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">What We Do</span>
          <h2>Five ways we move impact forward.</h2>
          <p className="section-lede">
            Alongside the platform, we work directly with funders, NGOs,
            corporates and governments who want to act on what the ecosystem
            already knows drawing on the same intelligence, network and
            credibility woven through everything else here.
          </p>
        </div>
        <div className="services-grid">
          <div className="service-list" id="serviceList">
            {SERVICES.map((s, i) => (
              <div
                key={s.num}
                className={`service-item${i === active ? " active" : ""}`}
                data-s={i}
                onClick={() => setActive(i)}
              >
                <span className="s-num">{s.num}</span>
                <h3>{s.title}</h3>
              </div>
            ))}
          </div>
          <div className="service-panels" id="servicePanels">
            {SERVICES.map((s, i) => (
              <div
                key={s.num}
                className={`service-panel${i === active ? " active" : ""}`}
                data-p={i}
              >
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
                <ul className="service-audience">
                  {s.audience.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                <div className="service-spotlight">
                  <strong>Spotlight</strong>
                  {s.spotlight}
                </div>
              </div>
            ))}
          </div>
        </div>
        <a href="#join" className="btn-primary magnetic services-cta">
          Talk to Our Team
        </a>
      </div>
    </section>
  );
}
