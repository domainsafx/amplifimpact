"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "network" | "team" | null;
type Track = "funder" | "builder" | "institution" | "individual" | "";
type Step = "persona" | "org" | "intent" | "collab" | "impact" | "match" | "contact";
type EntryMode = "Both doors" | "Join the Network" | "Talk to Our Team";

type FormState = {
  persona: string;
  orgName: string;
  website: string;
  country: string;
  city: string;
  sectors: string[];
  size: string;
  intents: string[];
  seeking: string[];
  challenge: string;
  geos: string[];
  reach: string;
  budget: string;
  stage: string;
  meet: string[];
  contribute: string[];
  name: string;
  role: string;
  email: string;
  phone: string;
  linkedin: string;
  channel: string;
};

type Props = {
  entryMode?: EntryMode;
  autoAdvance?: boolean;
  showMatchPreview?: boolean;
};

const EMPTY_FORM: FormState = {
  persona: "",
  orgName: "",
  website: "",
  country: "",
  city: "",
  sectors: [],
  size: "",
  intents: [],
  seeking: [],
  challenge: "",
  geos: [],
  reach: "",
  budget: "",
  stage: "",
  meet: [],
  contribute: [],
  name: "",
  role: "",
  email: "",
  phone: "",
  linkedin: "",
  channel: "",
};

const PERSONAS = [
  "NGO / Nonprofit Leader",
  "Social Entrepreneur",
  "CSR / Corporate Sustainability Leader",
  "Foundation / Philanthropy",
  "Government Official",
  "Academic / Researcher",
  "Impact Investor",
  "Media Professional",
  "Technology Company",
  "Independent Consultant",
  "Student / Emerging Leader",
  "Other",
];

const SECTORS = [
  "Climate Change", "Education", "Health", "Women’s Empowerment", "Livelihoods",
  "Agriculture", "Biodiversity", "Water", "Energy", "Governance",
  "Technology for Good", "Youth Development", "Mental Health",
  "Disability Inclusion", "Other",
];

const INTENTS = [
  "Find partners", "Access funders", "Discover innovative solutions",
  "Explore consulting support", "Join events and forums", "Learn from peers",
  "Share knowledge", "Build visibility", "Access research and intelligence",
  "Explore policy engagement", "Recruit talent", "Join fellowship programs",
];

const GEOS = [
  "Global", "South Asia", "Southeast Asia", "East Asia",
  "Middle East & North Africa", "Sub-Saharan Africa", "Europe",
  "North America", "Latin America & Caribbean", "Oceania",
];

const MEET = [
  "Funders", "Corporates", "Governments", "NGOs",
  "Researchers", "Social Entrepreneurs", "Media", "Investors",
];

const CONTRIBUTE = [
  "Knowledge", "Funding", "Mentorship", "Technology",
  "Partnerships", "Research", "Policy Influence", "Volunteer Support",
];

const CHANNELS = ["Email", "Phone", "WhatsApp", "Video Call"];

const LABELS: Record<Step, string> = {
  persona: "About you",
  org: "Organisation",
  intent: "What brings you here",
  collab: "Collaboration",
  impact: "Impact profile",
  match: "Network matching",
  contact: "Contact",
};

const FORUMS: Record<string, string> = {
  "Climate Change": "Climate Resilience Forum · Nairobi",
  Water: "Climate Resilience Forum · Nairobi",
  Biodiversity: "Climate Resilience Forum · Nairobi",
  Education: "Learning Futures Forum · Delhi",
  "Youth Development": "Learning Futures Forum · Delhi",
  Health: "Health Systems Forum · Geneva",
  "Mental Health": "Health Systems Forum · Geneva",
  Livelihoods: "Inclusive Economies Forum · São Paulo",
  Agriculture: "Inclusive Economies Forum · São Paulo",
  "Technology for Good": "Frontier Tech Forum · Singapore",
};

function trackFor(persona: string): Track {
  if (["Foundation / Philanthropy", "Impact Investor", "CSR / Corporate Sustainability Leader"].includes(persona)) return "funder";
  if (["NGO / Nonprofit Leader", "Social Entrepreneur"].includes(persona)) return "builder";
  if (["Government Official", "Academic / Researcher", "Technology Company", "Media Professional"].includes(persona)) return "institution";
  if (persona) return "individual";
  return "";
}

export default function EcosystemIntake({
  entryMode = "Both doors",
  autoAdvance = true,
  showMatchPreview = true,
}: Props) {
  const [mode, setMode] = useState<Mode>(
    entryMode === "Join the Network" ? "network" :
    entryMode === "Talk to Our Team" ? "team" : null
  );
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [touchedMeet, setTouchedMeet] = useState(false);
  const [f, setF] = useState<FormState>(EMPTY_FORM);

  const track = trackFor(f.persona);

  const steps = useMemo<Step[]>(() => {
    if (mode === "team") return ["persona", "org", "collab", "contact"];
    const all: Step[] = ["persona", "org", "intent", "collab", "impact", "match", "contact"];
    return track === "individual" ? all.filter((s) => s !== "impact") : all;
  }, [mode, track]);

  const current = steps[idx];

  const suggestedMeet = useMemo(() => {
    const out: string[] = [];
    const add = (x: string) => { if (!out.includes(x)) out.push(x); };

    if (f.intents.includes("Access funders") || f.seeking.includes("Funding")) {
      add("Funders"); add("Investors");
    }
    if (f.intents.includes("Find partners")) {
      add("NGOs"); add("Corporates");
    }
    if (f.intents.includes("Explore policy engagement") || f.seeking.includes("Government Connections")) add("Governments");
    if (f.intents.includes("Access research and intelligence") || f.seeking.includes("Research")) add("Researchers");
    if (f.intents.includes("Build visibility") || f.seeking.includes("Media Visibility")) add("Media");
    if (f.intents.includes("Discover innovative solutions")) add("Social Entrepreneurs");
    if (track === "funder") { add("Social Entrepreneurs"); add("NGOs"); }
    return out;
  }, [f.intents, f.seeking, track]);

  const meetList = touchedMeet ? f.meet : suggestedMeet;

  const seekList = useMemo(() => {
    if (track === "funder") {
      return ["Pipeline & investees", "Co-funding partners", "Implementation Partners", "Due Diligence Support", "Research", "Government Connections", "Technology", "Media Visibility", "Strategic Advisory", "Policy Alignment"];
    }
    if (track === "institution") {
      return ["Field Partners", "Research Collaborators", "Funding", "Data Access", "CSR Partners", "Government Connections", "Technology", "Media Visibility", "Strategic Advisory", "Implementation Partners"];
    }
    return ["Funding", "Partnerships", "Technology", "Research", "Government Connections", "CSR Partners", "Implementation Partners", "Media Visibility", "Strategic Advisory", "Investment"];
  }, [track]);

  const sizeSet = useMemo(() => {
    if (f.persona === "Government Official") {
      return { label: "Level of government", opts: ["Local / Municipal", "State / Provincial", "National", "Multilateral / Inter-governmental"] };
    }
    if (track === "individual") return { label: "Practice size", opts: ["Individual", "2–10", "11–50", "51–200", "200+"] };
    return { label: "Organisation size", opts: ["Individual", "2–10", "11–50", "51–200", "200+"] };
  }, [f.persona, track]);

  const stageSet = useMemo(() => {
    if (track === "funder") {
      return {
        label: "Where is your capital vehicle today?",
        opts: ["Exploring / New mandate", "First fund or programme", "Fund II and beyond", "Evergreen / Endowed", "Mature institutional funder"],
      };
    }
    return { label: "Stage", opts: ["Idea", "Pilot", "Early Growth", "Scaling", "Mature Organization"] };
  }, [track]);

  const canContinue = () => {
    if (!current) return true;
    if (current === "persona") return !!f.persona;
    if (current === "org") return !!f.orgName.trim() && !!f.country.trim() && f.sectors.length > 0;
    if (current === "intent") return f.intents.length > 0;
    if (current === "collab") return f.seeking.length > 0 && f.challenge.trim().length > 15;
    if (current === "impact") return !!f.stage;
    if (current === "match") return meetList.length > 0;
    if (current === "contact") return !!f.name.trim() && /.+@.+\..+/.test(f.email) && !!f.channel;
    return true;
  };

  const update = (patch: Partial<FormState>) => setF((s) => ({ ...s, ...patch }));

  const toggle = (key: "sectors" | "intents" | "seeking" | "geos" | "meet" | "contribute", value: string) => {
    setF((s) => {
      const list = s[key];
      return { ...s, [key]: list.includes(value) ? list.filter((x) => x !== value) : [...list, value] };
    });
    if (key === "meet") setTouchedMeet(true);
  };

  const start = (nextMode: "network" | "team") => {
    setMode(nextMode);
    setIdx(0);
    setDone(false);
  };

  const scrollToIntake = () => {
    requestAnimationFrame(() => {
      document.getElementById("join")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const next = () => {
    if (!canContinue()) return;

    if (idx >= steps.length - 1) {
      setDone(true);
      scrollToIntake();
      return;
    }

    setIdx((i) => i + 1);
    scrollToIntake();
  };

  const back = () => {
    if (idx === 0) {
      if (entryMode === "Both doors") {
        setMode(null);
        scrollToIntake();
      }
      return;
    }

    setIdx((i) => i - 1);
    scrollToIntake();
  };

  const restart = () => {
    setMode(null);
    setIdx(0);
    setDone(false);
    setTouchedMeet(false);
    setF(EMPTY_FORM);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.shiftKey) return;
      if ((e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (!mode || done) return;
      if (canContinue()) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const matchRows = useMemo(() => {
    const sector = f.sectors[0] || "your sector";
    const place = f.country.trim() || f.geos[0] || "your region";
    const seed = f.sectors.length * 11 + f.intents.length * 7 + f.seeking.length * 5;
    const forum = FORUMS[sector] || "Impact Futures Forum · Singapore";

    const first = track === "funder"
      ? { num: 34 + seed, text: `vetted organisations working on ${sector} in ${place}, ready for diligence` }
      : { num: 12 + Math.round(seed / 2), text: `active funders backing ${sector} work in ${place}` };

    const rows = [
      first,
      { num: 3, text: `introductions the network team will draft for you: ${meetList.slice(0, 3).join(", ").toLowerCase()}` },
      { num: "Q1", text: `${forum} — your profile qualifies for a delegate seat` },
    ];

    if (f.intents.includes("Explore consulting support") || f.seeking.includes("Strategic Advisory")) {
      rows[2] = { num: "48h", text: "an advisory partner will respond to your brief before the forum invite" };
    }
    return rows;
  }, [f, meetList, track]);

  const words = f.challenge.trim() ? f.challenge.trim().split(/\s+/).length : 0;
  const remaining = Math.max(0, steps.length - idx);
  const secs = remaining * 22;
  const pct = Math.round((idx / Math.max(steps.length, 1)) * 100);

  const profileChips = [f.persona, f.country, f.sectors[0], f.sectors.length > 1 ? `+${f.sectors.length - 1} sectors` : ""].filter(Boolean);

  const trackNote = track === "funder"
    ? "Funder track — we’ll ask about deployment, not fundraising."
    : track === "builder"
    ? "Implementer track — we’ll map you to capital and delivery partners."
    : track === "institution"
    ? "Institution track — we’ll route you to policy, research and field partners."
    : track === "individual"
    ? "Individual track — shorter path, straight to people and programmes."
    : "";

  const refCode = `AI-${2600 + f.sectors.length * 13 + f.intents.length * 7 + (f.name.length || 3)}`;

  const nextActions = [
    {
      label: "Book a Strategy Call",
      desc: "45 minutes with an advisor on your brief.",
      tag: "Advisory",
      primary: f.intents.includes("Explore consulting support") || f.seeking.includes("Strategic Advisory") || mode === "team",
    },
    { label: "Join Upcoming Forums", desc: "Year-round convening across five regions.", tag: "Convening", primary: false },
    { label: "Explore the Ecosystem Map", desc: "See who is already working near you.", tag: "Network", primary: false },
    { label: "Submit an Opportunity", desc: "Post a challenge, mandate or partnership.", tag: "Exchange", primary: false },
    { label: "Browse the Impact Directory", desc: "Profiles, evidence and track records.", tag: "Intelligence", primary: false },
  ];

  const optionStyle = (selected: boolean) => ({
    background: selected ? "rgba(66,217,255,.14)" : "rgba(255,255,255,.04)",
    borderColor: selected ? "#42D9FF" : "rgba(255,255,255,.18)",
    color: selected ? "#fff" : "#C7D6E5",
  });

  const Option = ({
    label,
    selected,
    onClick,
    mono = false,
    tag,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
    mono?: boolean;
    tag?: string;
  }) => (
    <button
      type="button"
      className={`intake-option ${mono ? "mono" : ""}`}
      style={optionStyle(selected)}
      onClick={onClick}
    >
      <span className="option-dot" style={{ background: selected ? "#42D9FF" : "rgba(255,255,255,.22)" }} />
      {label}
      {tag && <span className="option-tag">{tag}</span>}
    </button>
  );

  const renderStep = () => {
    if (done) {
      return (
        <div className="intake-step done-step">
          <div>
            <span className="eyebrow">Profile received · {refCode}</span>
            <h2>Welcome to AmplifImpact</h2>
            <p className="lead">
              You're now part of a growing global ecosystem of changemakers,
              funders, innovators, and institutions shaping the future.
            </p>
          </div>

          <div className="match-list done-list">
            {matchRows.map((row) => (
              <div className="match-row" key={`${row.num}-${row.text}`}>
                <strong>{row.num}</strong>
                <span>{row.text}</span>
              </div>
            ))}
          </div>

          <div>
            <span className="field-label">Your next actions</span>
            <div className="next-actions">
              {nextActions.map((a) => (
                <a
                  href="#"
                  key={a.label}
                  className="next-action"
                  style={{
                    borderColor: a.primary ? "#2F6BFF" : "rgba(255,255,255,.16)",
                    background: a.primary ? "rgba(47,107,255,.16)" : "rgba(255,255,255,.04)",
                  }}
                >
                  <span style={{ color: a.primary ? "#42D9FF" : "#7A93AA" }}>
                    {a.primary ? `Recommended · ${a.tag}` : a.tag}
                  </span>
                  <strong>{a.label}</strong>
                  <small style={{ color: a.primary ? "#C7D6E5" : "#AFC2D6" }}>{a.desc}</small>
                </a>
              ))}
            </div>
          </div>

          <button type="button" className="restart" onClick={restart}>
            ← Submit another profile
          </button>
        </div>
      );
    }

    if (!mode) {
      return (
        <div className="intake-step entry-step">
          <div>
            <span className="eyebrow">The Ecosystem Desk</span>
            <h1>Two ways in.</h1>
            <p className="lead">
              Tell us who you are and what you are trying to move. We route you
              to the funders, partners, forums and advisors already working on it.
            </p>
          </div>

          <div className="door-grid">
            <button className="door-card" onClick={() => start("network")}>
              <span className="card-kicker">Full profile · 7 steps</span>
              <strong>Join the Network</strong>
              <p>Get matched with funders, implementation partners, research and forums across the ecosystem.</p>
              <span className="start-label">Start →</span>
            </button>

            <button className="door-card team-door" onClick={() => start("team")}>
              <span className="card-kicker">Fast track · 4 steps</span>
              <strong>Talk to Our Team</strong>
              <p>Bring a specific mandate, partnership or advisory brief straight to a senior advisor.</p>
              <span className="start-label">Start →</span>
            </button>
          </div>
        </div>
      );
    }

    if (current === "persona") {
      return (
        <div className="intake-step">
          <div>
            <span className="eyebrow">About you</span>
            <h2>Who best describes you?</h2>
            <p className="sublead">One answer. It decides everything we ask after this.</p>
          </div>
          <div className="option-wrap">
            {PERSONAS.map((p) => (
              <Option
                key={p}
                label={p}
                selected={f.persona === p}
                onClick={() => {
                  update({ persona: p });
                  if (autoAdvance) setTimeout(() => next(), 280);
                }}
              />
            ))}
          </div>
          {trackNote && <p className="track-note">{trackNote}</p>}
        </div>
      );
    }

    if (current === "org") {
      const individual = track === "individual";
      return (
        <div className="intake-step">
          <div>
            <span className="eyebrow">Organisation</span>
            <h2>{individual ? "Where do you sit today?" : "Tell us about your organisation."}</h2>
            <p className="sublead">
              {individual
                ? "Independent is a valid answer. We still match you on sector and geography."
                : "This is what the matching engine reads first: who you are, where you work, what you work on."}
            </p>
          </div>

          <div className="field-grid">
            <Field label={individual ? "Organisation or affiliation" : "Organisation name"} value={f.orgName} placeholder="Organisation name" onChange={(v) => update({ orgName: v })} />
            <Field label="Website" value={f.website} placeholder="https://" onChange={(v) => update({ website: v })} />
            <Field label="Country" value={f.country} placeholder="Country" onChange={(v) => update({ country: v })} />
            <Field label="City" value={f.city} placeholder="City" onChange={(v) => update({ city: v })} />
          </div>

          <div className="field-group">
            <span className="field-label">Sector focus · select all that apply</span>
            <div className="option-wrap compact">
              {SECTORS.map((s) => (
                <Option key={s} label={s} mono selected={f.sectors.includes(s)} onClick={() => toggle("sectors", s)} />
              ))}
            </div>
          </div>

          <div className="field-group">
            <span className="field-label">{sizeSet.label}</span>
            <div className="option-wrap compact">
              {sizeSet.opts.map((s) => (
                <Option key={s} label={s} selected={f.size === s} onClick={() => update({ size: s })} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (current === "intent") {
      return (
        <div className="intake-step">
          <div>
            <span className="eyebrow">Intent</span>
            <h2>What brings you here?</h2>
            <p className="sublead">Select all that apply. Each one opens a different door in the network.</p>
          </div>
          <div className="option-wrap">
            {INTENTS.map((i) => (
              <Option key={i} label={i} selected={f.intents.includes(i)} onClick={() => toggle("intents", i)} />
            ))}
          </div>
          {f.intents.includes("Explore consulting support") && (
            <p className="track-note">Noted — an advisory partner will be attached to your file.</p>
          )}
          {f.intents.includes("Join fellowship programs") && (
            <p className="track-note">Fellowship applications open twice a year; we’ll flag the next window.</p>
          )}
        </div>
      );
    }

    if (current === "collab") {
      const funder = track === "funder";
      return (
        <div className="intake-step">
          <div>
            <span className="eyebrow">Collaboration</span>
            <h2>{funder ? "What are you looking to deploy?" : "What are you currently looking for?"}</h2>
            <p className="sublead">
              {funder
                ? "We match capital to vetted pipeline, co-funders and delivery partners."
                : "Pick everything that is live for you right now. Vague gets vague matches."}
            </p>
          </div>

          <div className="option-wrap">
            {seekList.map((s) => (
              <Option key={s} label={s} selected={f.seeking.includes(s)} onClick={() => toggle("seeking", s)} />
            ))}
          </div>

          <label className="textarea-field">
            <span>{funder ? "The hardest part of deploying well right now · up to 300 words" : "Your biggest challenge right now · up to 300 words"}</span>
            <textarea
              value={f.challenge}
              onChange={(e) => update({ challenge: e.target.value })}
              rows={5}
              maxLength={3000}
              placeholder="The one thing that would change the trajectory of your work in the next 12 months."
            />
            <small>{words} / 300 words</small>
          </label>
        </div>
      );
    }

    if (current === "impact") {
      const funder = track === "funder";
      return (
        <div className="intake-step">
          <div>
            <span className="eyebrow">Impact profile</span>
            <h2>{funder ? "Your portfolio in numbers." : "Your impact in numbers."}</h2>
            <p className="sublead">Scale and stage decide which rooms and which capital are a fit. Approximate is fine.</p>
          </div>

          <ChoiceGroup label="Geographies you work in" options={GEOS} selected={f.geos} toggle={(x) => toggle("geos", x)} mono />
          <ChoiceGroup
            label={funder ? "Beneficiaries reached through your portfolio, annually" : "Beneficiaries reached annually"}
            options={["Under 1,000", "1,000–10,000", "10,000–100,000", "100,000–1M", "1M+"]}
            selected={[f.reach]}
            toggle={(x) => update({ reach: x })}
          />
          <ChoiceGroup
            label={funder ? "Annual capital deployed" : "Annual budget"}
            options={["Under $50K", "$50K–$250K", "$250K–$1M", "$1M–$5M", "$5M–$25M", "$25M+"]}
            selected={[f.budget]}
            toggle={(x) => update({ budget: x })}
          />
          <ChoiceGroup label={stageSet.label} options={stageSet.opts} selected={[f.stage]} toggle={(x) => update({ stage: x })} />
        </div>
      );
    }

    if (current === "match") {
      return (
        <div className="intake-step">
          <div>
            <span className="eyebrow">Network matching</span>
            <h2>Who would you like to meet?</h2>
            <p className="sublead">
              {touchedMeet
                ? "Adjust freely — introductions are drafted by a human before they are sent."
                : "Pre-selected from your answers. Change anything that looks wrong."}
            </p>
          </div>

          <div className="option-wrap">
            {MEET.map((m) => {
              const selected = meetList.includes(m);
              const suggested = !touchedMeet && selected;
              return (
                <Option
                  key={m}
                  label={m}
                  selected={selected}
                  tag={suggested ? "suggested" : undefined}
                  onClick={() => {
                    if (!touchedMeet) {
                      setTouchedMeet(true);
                      update({ meet: meetList.filter((x) => x !== m) });
                    } else {
                      toggle("meet", m);
                    }
                  }}
                />
              );
            })}
          </div>

          <div className="field-group contribution">
            <span className="field-label">How can you contribute to the ecosystem?</span>
            <div className="option-wrap compact">
              {CONTRIBUTE.map((c) => (
                <Option key={c} label={c} mono selected={f.contribute.includes(c)} onClick={() => toggle("contribute", c)} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="intake-step">
        <div>
          <span className="eyebrow">Final step</span>
          <h2>{mode === "team" ? "Where should the team reach you?" : "Last thing — how do we reach you?"}</h2>
          <p className="sublead">
            {mode === "team"
              ? "A senior advisor reads every brief. Expect a reply within two business days."
              : "We never publish your contact details. Introductions are opt-in on both sides."}
          </p>
        </div>

        <div className="field-grid">
          <Field label="Full name" value={f.name} placeholder="Full name" onChange={(v) => update({ name: v })} />
          <Field label="Designation" value={f.role} placeholder="Title or role" onChange={(v) => update({ role: v })} />
          <Field label="Work email" value={f.email} placeholder="name@organisation.org" type="email" onChange={(v) => update({ email: v })} />
          <Field label={f.channel === "WhatsApp" || f.channel === "Phone" ? "Phone · required for this channel" : "Phone"} value={f.phone} placeholder="+00 00000 00000" onChange={(v) => update({ phone: v })} />
          <Field label="LinkedIn" value={f.linkedin} placeholder="linkedin.com/in/" onChange={(v) => update({ linkedin: v })} />
        </div>

        <ChoiceGroup label="Preferred way to connect" options={CHANNELS} selected={[f.channel]} toggle={(x) => update({ channel: x })} />

        {showMatchPreview && f.persona && f.sectors.length > 0 && (
          <div className="preview-box">
            <span>Waiting on the other side</span>
            {matchRows.map((row) => (
              <div className="preview-row" key={`${row.num}-${row.text}`}>
                <strong>{row.num}</strong>
                <p>{row.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        #join { scroll-margin-top: 20px; }
        body { margin: 0; background: #102A43; -webkit-font-smoothing: antialiased; }
        a { color: #42D9FF; text-decoration: none; }
        a:hover { color: #fff; }
        input, textarea, button { font-family: inherit; }
        input::placeholder, textarea::placeholder { color: #5B7690; }
        ::selection { background: #2F6BFF; color: #fff; }
        :focus-visible { outline: 2px solid #42D9FF; outline-offset: 2px; }

        @keyframes stepIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .ecosystem-intake {
          min-height: 100vh;
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          background: #102A43;
          font-family: "Inter", sans-serif;
          color: #fff;
        }

        .intake-rail {
          flex: 1 1 300px;
          max-width: 400px;
          background: #071827;
          padding: 36px 32px 32px;
          display: flex;
          flex-direction: column;
          gap: 30px;
          border-right: 1px solid rgba(255,255,255,.08);
        }

        .rail-brand { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; }
        .rail-brand strong { font-family:"Space Grotesk",sans-serif; font-size:18px; letter-spacing:.02em; }
        .rail-brand span, .rail-small, .field-label, .eyebrow, .card-kicker, .track-note,
        .intake-field > span, .textarea-field > span, .textarea-field small,
        .preview-box > span, .option-tag, .restart {
          font-family:"IBM Plex Mono",monospace;
        }
        .rail-brand span { font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; color:#7A93AA; }

        .rail-steps { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; }
        .rail-step { display:flex; align-items:center; gap:14px; padding:9px 0; }
        .rail-step-badge {
          width:26px; height:26px; flex-shrink:0; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-family:"IBM Plex Mono",monospace; font-size:10.5px;
          border:1px solid rgba(255,255,255,.18);
        }
        .rail-step-label { font-size:14px; font-weight:500; color:#5B7690; }
        .profile-box { padding-top:24px; border-top:1px solid rgba(255,255,255,.08); }
        .profile-chips { display:flex; flex-wrap:wrap; gap:7px; margin-top:12px; }
        .profile-chip {
          font-family:"IBM Plex Mono",monospace; font-size:11.5px; color:#42D9FF;
          background:rgba(66,217,255,.09); border:1px solid rgba(66,217,255,.28);
          padding:5px 12px; border-radius:100px;
        }
        .rail-footer { margin-top:auto; display:flex; flex-direction:column; gap:10px; padding-top:28px; }
        .rail-footer strong { font-family:"IBM Plex Mono",monospace; font-size:11px; color:#42D9FF; letter-spacing:.06em; }
        .rail-footer p { margin:0; font-size:13px; line-height:1.55; color:#7A93AA; }

        .intake-main { flex:999 1 560px; display:flex; flex-direction:column; min-height:100vh; position:relative; }
        .progress-area { padding:26px clamp(24px,5vw,64px) 0; display:flex; flex-direction:column; gap:14px; }
        .progress-meta { display:flex; justify-content:space-between; align-items:baseline; gap:16px; font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; }
        .progress-meta span:last-child { color:#7A93AA; }
        .progress-track { height:2px; background:rgba(255,255,255,.14); border-radius:2px; overflow:hidden; }
        .progress-bar { height:100%; background:#2F6BFF; border-radius:2px; transition:width .5s cubic-bezier(.2,.7,.2,1); }

        .intake-content { flex:1; display:flex; flex-direction:column; justify-content:center; padding:clamp(28px,5vw,56px) clamp(24px,5vw,64px); max-width:860px; width:100%; }
        .intake-step { animation:stepIn .45s cubic-bezier(.2,.7,.2,1) both; display:flex; flex-direction:column; gap:26px; }
        .entry-step { gap:28px; }
        .eyebrow { font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:#42D9FF; }
        h1, h2 { font-family:"Space Grotesk",sans-serif; font-weight:600; color:#fff; letter-spacing:-.025em; }
        h1 { font-size:clamp(34px,5.4vw,58px); line-height:1.02; margin:16px 0 0; }
        h2 { font-size:clamp(28px,4.4vw,46px); line-height:1.04; margin:14px 0 0; }
        .lead { margin:16px 0 0; font-size:17px; line-height:1.55; color:#AFC2D6; max-width:620px; }
        .sublead { margin:14px 0 0; font-size:16px; line-height:1.55; color:#AFC2D6; max-width:540px; }

        .door-grid { display:flex; flex-wrap:wrap; gap:16px; }
        .door-card {
          flex:1 1 260px; text-align:left; cursor:pointer; background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.18); border-radius:16px; padding:28px;
          display:flex; flex-direction:column; gap:10px; transition:.22s; color:#fff;
        }
        .door-card:hover { border-color:#2F6BFF; background:rgba(47,107,255,.10); transform:translateY(-2px); }
        .door-card.team-door:hover { border-color:#42D9FF; background:rgba(66,217,255,.09); }
        .card-kicker { font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; color:#42D9FF; }
        .door-card strong { font-family:"Space Grotesk",sans-serif; font-size:24px; letter-spacing:-.015em; }
        .door-card p { margin:0; font-size:14.5px; line-height:1.55; color:#AFC2D6; }
        .start-label { font-family:"IBM Plex Mono",monospace; font-size:12px; margin-top:6px; }

        .option-wrap { display:flex; flex-wrap:wrap; gap:10px; }
        .option-wrap.compact { gap:8px; }
        .intake-option {
          display:inline-flex; align-items:center; gap:10px; font-family:"Space Grotesk",sans-serif;
          font-weight:600; font-size:15px; padding:13px 22px; border-radius:100px;
          cursor:pointer; transition:.18s; border:1px solid;
        }
        .intake-option.mono { font-family:"IBM Plex Mono",monospace; font-size:12.5px; padding:9px 16px; }
        .option-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
        .option-tag { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:#42D9FF; }

        .track-note { margin:0; font-size:12.5px; line-height:1.6; color:#42D9FF; animation:fadeIn .4s both; }
        .field-grid { display:flex; flex-wrap:wrap; gap:16px; }
        .intake-field { flex:1 1 240px; display:flex; flex-direction:column; gap:8px; }
        .intake-field > span, .field-label, .textarea-field > span {
          font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:#7A93AA;
        }
        .intake-field input, .textarea-field textarea {
          width:100%; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.18);
          border-radius:10px; padding:14px 16px; color:#fff; font-size:15px; outline:none;
          transition:border-color .2s;
        }
        .intake-field input:focus, .textarea-field textarea:focus { border-color:#42D9FF; }
        .field-group { display:flex; flex-direction:column; gap:12px; }
        .textarea-field { display:flex; flex-direction:column; gap:10px; }
        .textarea-field textarea { border-radius:12px; line-height:1.6; resize:vertical; }
        .textarea-field small { align-self:flex-end; font-size:11px; color:#5B7690; }
        .contribution { padding-top:8px; border-top:1px solid rgba(255,255,255,.1); }

        .preview-box {
          display:flex; flex-direction:column; gap:12px; background:rgba(66,217,255,.06);
          border:1px solid rgba(66,217,255,.22); border-radius:14px; padding:20px 22px;
          animation:fadeIn .4s both;
        }
        .preview-box > span { font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:#42D9FF; }
        .preview-row { display:flex; gap:14px; align-items:baseline; flex-wrap:wrap; }
        .preview-row strong { font-family:"Space Grotesk",sans-serif; font-size:20px; min-width:56px; }
        .preview-row p { margin:0; font-size:14.5px; line-height:1.5; color:#C7D6E5; flex:1 1 220px; }

        .intake-footer {
          display:flex; align-items:center; gap:16px; flex-wrap:wrap;
          padding:20px clamp(24px,5vw,64px) 28px; border-top:1px solid rgba(255,255,255,.1);
          background:rgba(7,24,39,.5);
        }
        .footer-button {
          font-weight:600; font-size:14.5px; padding:13px 22px; border-radius:100px;
          cursor:pointer; transition:.2s; border:1px solid rgba(255,255,255,.2);
          background:none; color:#AFC2D6;
        }
        .footer-button:hover { border-color:#fff; color:#fff; }
        .footer-button.primary { font-size:15px; padding:14px 30px; }
        .footer-hint { font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.06em; color:#5B7690; margin-left:auto; }

        .done-step { padding:20px 0; gap:30px; }
        .match-list { display:flex; flex-direction:column; border-top:1px solid rgba(255,255,255,.12); }
        .match-row { display:flex; gap:20px; align-items:baseline; flex-wrap:wrap; padding:16px 0; border-bottom:1px solid rgba(255,255,255,.12); }
        .match-row strong { font-family:"Space Grotesk",sans-serif; font-weight:700; font-size:26px; color:#42D9FF; min-width:68px; }
        .match-row span { font-size:15px; line-height:1.5; color:#C7D6E5; flex:1 1 240px; }
        .field-label { display:block; margin-bottom:12px; }
        .next-actions { display:flex; flex-wrap:wrap; gap:12px; }
        .next-action { flex:1 1 240px; display:flex; flex-direction:column; gap:8px; padding:22px; border-radius:14px; text-decoration:none; transition:.22s; border:1px solid; }
        .next-action:hover { transform:translateY(-2px); border-color:#42D9FF !important; }
        .next-action span { font-family:"IBM Plex Mono",monospace; font-size:10px; letter-spacing:.14em; text-transform:uppercase; }
        .next-action strong { font-family:"Space Grotesk",sans-serif; font-weight:600; font-size:18px; color:#fff; }
        .next-action small { font-size:13.5px; line-height:1.5; }
        .restart { align-self:flex-start; background:none; border:none; cursor:pointer; font-size:12px; letter-spacing:.06em; color:#7A93AA; padding:4px 0; }
        .restart:hover { color:#42D9FF; }

        @media (max-width: 800px) {
          .ecosystem-intake { flex-direction:column; }
          .intake-rail { max-width:none; width:100%; border-right:0; border-bottom:1px solid rgba(255,255,255,.08); padding:24px; gap:20px; }
          .rail-steps { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); }
          .rail-footer { display:none; }
          .intake-main { min-height:calc(100vh - 250px); }
        }

        @media (max-width: 560px) {
          .intake-rail { padding:20px; }
          .rail-steps { grid-template-columns:1fr; }
          .intake-content { padding:32px 20px; }
          .progress-area { padding:20px 20px 0; }
          .intake-footer { padding:18px 20px 22px; }
          .footer-hint { width:100%; margin-left:0; }
          .footer-button { width:100%; }
          .intake-option { font-size:14px; padding:11px 17px; }
          .door-card { padding:22px; }
        }
      `}</style>

      <div className="ecosystem-intake" id="join">
        <aside className="intake-rail">
          <div className="rail-brand">
            <strong>AmplifImpact</strong>
            <span>{mode === "team" ? "Advisory intake" : "Network intake"}</span>
          </div>

          {mode && !done && (
            <ol className="rail-steps">
              {steps.map((step, i) => {
                const isDone = i < idx;
                const active = i === idx;
                return (
                  <li className="rail-step" key={step}>
                    <span
                      className="rail-step-badge"
                      style={{
                        background: active ? "#2F6BFF" : isDone ? "rgba(66,217,255,.14)" : "transparent",
                        borderColor: active ? "#2F6BFF" : isDone ? "rgba(66,217,255,.4)" : "rgba(255,255,255,.18)",
                        color: active ? "#fff" : isDone ? "#42D9FF" : "#5B7690",
                      }}
                    >
                      {isDone ? "✓" : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="rail-step-label" style={{ color: active ? "#fff" : isDone ? "#AFC2D6" : "#5B7690" }}>
                      {LABELS[step]}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          {mode && !done && profileChips.length > 0 && (
            <div className="profile-box">
              <span className="field-label">Your profile so far</span>
              <div className="profile-chips">
                {profileChips.map((chip) => <span className="profile-chip" key={chip}>{chip}</span>)}
              </div>
            </div>
          )}

          <div className="rail-footer">
            <strong>Under 3 minutes</strong>
            <p>Every intake is read by the network team. Matched introductions and forum invitations follow within two business days.</p>
          </div>
        </aside>

        <main className="intake-main">
          {mode && !done && (
            <div className="progress-area">
              <div className="progress-meta">
                <span>Step {idx + 1} of {steps.length} · {LABELS[current]}</span>
                <span>≈ {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")} left</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          <div className="intake-content">
            {renderStep()}
          </div>

          {mode && !done && (
            <div className="intake-footer">
              <button type="button" className="footer-button" onClick={back}>Back</button>
              <button
                type="button"
                className="footer-button primary"
                onClick={next}
                disabled={!canContinue()}
                style={{
                  borderColor: canContinue() ? "#2F6BFF" : "rgba(255,255,255,.14)",
                  background: canContinue() ? "#2F6BFF" : "rgba(255,255,255,.07)",
                  color: canContinue() ? "#fff" : "#5B7690",
                  cursor: canContinue() ? "pointer" : "not-allowed",
                }}
              >
                {current === "contact" ? "Submit & Explore Opportunities" : "Continue"}
              </button>
              <span className="footer-hint">
                {canContinue() ? "press Enter ↵" : current === "collab" ? "a sentence is enough" : "answer to continue"}
              </span>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="intake-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </label>
  );
}

function ChoiceGroup({
  label,
  options,
  selected,
  toggle,
  mono = false,
}: {
  label: string;
  options: string[];
  selected: string[];
  toggle: (value: string) => void;
  mono?: boolean;
}) {
  return (
    <div className="field-group">
      <span className="field-label">{label}</span>
      <div className="option-wrap compact">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={`intake-option ${mono ? "mono" : ""}`}
              style={{
                background: active ? "rgba(66,217,255,.14)" : "rgba(255,255,255,.04)",
                borderColor: active ? "#42D9FF" : "rgba(255,255,255,.18)",
                color: active ? "#fff" : "#C7D6E5",
              }}
              onClick={() => toggle(option)}
            >
              <span className="option-dot" style={{ background: active ? "#42D9FF" : "rgba(255,255,255,.22)" }} />
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
