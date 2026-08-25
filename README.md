# AmplifImpact Next.js Port

A Next.js 14 (App Router, TypeScript) rebuild of the original static
`AmplifImpact` HTML site as real, idiomatic React components same design,
same copy/data, same interactions, driven by React state instead of direct
DOM manipulation.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build
npm run start
```

## Project structure

```
app/
  layout.tsx         # <head>, metadata, Google Fonts links
  globals.css         # original stylesheet (verbatim, in :root/CSS vars)
  page.tsx            # composes every section component in order

components/
  CursorGlow.tsx       # mouse-follow glow (ref + rAF)
  Nav.tsx              # scroll-aware nav + mobile menu (useState)
  Hero.tsx             # hero copy + animated constellation <canvas>
  Statement.tsx        # "Impact is everywhere" statement
  Model.tsx             # 4-part pinned scroll (Discover/Connect/Amplify/Act)
  Services.tsx          # 5-item accordion (What We Do)
  HowWork.tsx            # 4-tab grid (Discover/Connect/Amplify/Act)
  Ecosystem.tsx           # 5-node hover/click diagram, lines drawn in SVG
  Intelligence.tsx        # live search demo over a small dataset
  Thousand.tsx             # filterable directory + animated "1000" counter
  Amplification.tsx        # 6-step journey, staggered reveal on scroll
  Exchange.tsx              # challenge → scale flow
  Forums.tsx                 # horizontal-scroll forum list
  Policy.tsx                  # policy brief card
  Studio.tsx                   # editorial feature + card grid
  Challenge.tsx                 # challenge callout band
  Fellows.tsx                    # fellows grid
  IndexSection.tsx                # radar/spider chart with 3 presets
  Report.tsx                       # annual report stats with count-up
  Global.tsx                        # animated global hub map (SVG)
  Join.tsx                           # 3-step "who/what/contact" flow
  ContactExp.tsx                      # contact reason picker + reveal
  Footer.tsx                           # site footer
  MobileTabbar.tsx                      # bottom tab bar, active on scroll

hooks/
  useReveal.ts      # IntersectionObserver-based fade/slide-in for
                      # elements with .reveal / .reveal-line, scoped to a
                      # section's ref (mirrors the original site's
                      # scroll-reveal behaviour)
  useMagnetic.ts     # cursor-follow "magnetic" effect for elements with
                      # .magnetic inside a section's ref
```

## How the conversion was done

Every section of the original single HTML file became its own component:

- **Content and copy** are unchanged headings, body text, stats, forum
  dates, profile data, search results, radar-chart presets, etc. are all
  copied verbatim into typed arrays/objects at the top of each component.
- **Styling** is the original CSS, untouched, in `app/globals.css`. Class
  names (`.hero`, `.eco-node`, `.journey-step`, …) are the same, so the
  stylesheet applies without modification.
- **Interactivity** that was vanilla `document.querySelector` /
  `addEventListener` JS is now React: `useState` for things like the active
  services tab, filter, search query, join-flow step, and contact selection;
  `useEffect` + `IntersectionObserver` for scroll-triggered reveals and
  counters; `useRef` for the hero's animated canvas and the pinned "Model"
  scroll section.
- Two small shared hooks (`useReveal`, `useMagnetic`) replace the original's
  generic `.reveal` / `.magnetic` DOM-query passes, scoped per-section via a
  container `ref` so each component stays self-contained.

## Notes

- All 20+ sections render in the same order as the original page, with the
  same `id`s, so in-page anchor links (`#services`, `#ecosystem`, `#join`,
  etc.) work identically.
- The Google Fonts (`Space Grotesk`, `Inter`, `IBM Plex Mono`) are loaded
  the same way as before, via `<link>` tags in `app/layout.tsx`.
- `npm run build` was used to verify the whole thing compiles and
  type-checks (TypeScript strict mode) before delivery.
