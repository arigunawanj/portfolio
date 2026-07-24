# Blockchain-Dev Portfolio Redesign

Date: 2026-07-24
Status: Approved

## Purpose

Redesign the portfolio's visual layer to read as a blockchain/web3 developer's site — for a new client and for hackathon representation. Content/data model stays as-is (Prisma-driven), this is a presentation-layer pass across `app/page.tsx` and `components/*`.

## Direction

- **Style**: Network/chain motif — animated connecting nodes, chain-link dividers, block-style cards. Not cyberpunk-neon, not flat-minimal crypto — literally visualizes "blockchain."
- **Scope**: Full overhaul — hero, projects, tech-stack, work-experience, education, certification, contact, nav.
- **Palette**: Keep existing `--primary` `#4F8CFF` (electric blue) / `--secondary` `#8B5CF6` (violet) as base. Add a new `--chain` accent (cyan-green, e.g. `#22E5A0`, exact value tuned during implementation) for node-graph nodes/edges, "on-chain" status pills, block-card accent glow, and success states. `--background` `#0B1020` is kept.
- **Animation weight**: Hero gets a real 3D scene via Three.js (`@react-three/fiber` + `@react-three/drei`, new deps). Everywhere else stays CSS/SVG/framer-motion — no 3D outside the hero, to protect perf on judge/client devices.

## 1. Design tokens (`app/globals.css`)

Add to the `:root` / `.dark` blocks in `app/globals.css`:
- `--chain` HSL var (cyan-green) + `--color-chain` in the `@theme` block, following the existing pattern used for `--primary`/`--secondary`.
- Glass surface tokens: `--glass-bg: rgba(22,29,47,0.4)`, `--glass-border: rgba(255,255,255,0.08)`.
- A reusable `.glass-panel` utility class (backdrop-blur + glass bg/border) in `@layer utilities`, so cards/nav/badges share one definition instead of repeating inline classes.

No changes to existing `--primary`/`--secondary`/`--background` values.

## 2. Hero (`components/hero.tsx`)

- **Left column**: unchanged structure — keep the `$ whoami` `Terminal` block (dev credibility signal), headline, role, location, description, availability badge, CTA buttons, stats strip, favorite-tech pills. Sharpen typography weight/contrast where cheap to do (no layout rewrite). Availability badge area gets a small "on-chain verified" style badge using the new `--chain` accent.
- **Right column**: replace the static photo-in-gradient-circle with a Three.js scene:
  - New component `components/ui/node-network-scene.tsx`, client-only.
  - Scene: points distributed on/around an icosahedron or sphere, connected by lines where distance < threshold, slow auto-rotation, particles/pulses traveling along a subset of edges to suggest data flow. Colors drawn from `--primary`/`--secondary`/`--chain`.
  - Profile photo sits on a floating glass panel layered in front of or beside the 3D canvas (not textured onto 3D geometry — keeps photo crisp and simple).
  - Loaded via `next/dynamic` with `ssr: false` and a lightweight static fallback (gradient blob, matches current placeholder style) shown while loading and for `prefers-reduced-motion` users.
  - Perf: cap `dpr` (e.g. `[1, 1.5]`), pause the render loop via `IntersectionObserver` when the hero scrolls out of view, unmount/no scene at all on very small viewports if needed (decide during implementation based on actual frame cost).

## 3. Section dividers — chain motif

- New small component `components/ui/chain-divider.tsx`: a thin horizontal SVG row of connected node-dots with a traveling glow pulse animation (CSS/SVG only, no JS animation loop beyond CSS keyframes).
- Placed between major sections in `app/page.tsx` (between Hero/Projects/TechStack/WorkExperience/Education/Certification/Contact) as a lightweight visual rhythm device.

## 4. Cards — glass blocks + connectors

Applies to: `components/projects.tsx`, `components/work-experience.tsx`, `components/education.tsx`, `components/certification.tsx`.

- Card surface switches to the shared `.glass-panel` utility (backdrop-blur, translucent bg, subtle border) instead of today's flat `bg-[#161D2F]/40`.
- Card border/glow tint: the DB `color` field is a Tailwind gradient-class fragment (e.g. `"from-blue-500/20 to-cyan-500/20"`) that is typed on every model but never actually rendered anywhere today — interpolating raw DB strings into Tailwind classes doesn't work under JIT purge (arbitrary runtime strings aren't statically analyzable), so it's not usable directly as-is. Instead, glow color cycles a fixed 3-color accent array (`[primary, secondary, chain]`, i.e. `#4F8CFF` / `#8B5CF6` / the new chain accent) by card index, applied via inline `style` (CSS custom property), at low opacity, brightening on hover. The `color` DB field itself is left untouched (out of scope — no schema/admin changes).
- On hover, a small "node dot" glow appears at a card corner.
- For grid layouts with ≥2 columns at a given breakpoint: an SVG connector line animates (`pathLength` via framer-motion, triggered on scroll-into-view) between horizontally-adjacent cards, suggesting linked blocks.
- Connectors are hidden below `md` breakpoint where grids collapse to a single column — no connector logic needed for 1-col layouts, avoids awkward mobile lines.

## 5. Nav & contact polish

- `components/site-nav.tsx`: adopt `.glass-panel` treatment (already scroll-aware per existing behavior) for consistency with the new card/hero language.
- `components/contact.tsx`: there is no submit form here today — it's a grid of outbound connection links (GitHub/LinkedIn/Instagram/WhatsApp/Email) plus a location badge. These link cards adopt the same `.glass-panel` + index-cycled accent glow treatment as Section 4's cards, for visual consistency with the rest of the page. The existing "READY FOR REMOTE / HYBRID" badge switches to the new `--chain` accent color as a small on-brand touch. No fabricated interactions — behavior (external links, mailto) unchanged.

## 6. Responsive & verification

- Breakpoints to check manually in-browser: 375px, 768px, 1024px, 1440px.
- 3D canvas rendered in a fixed-aspect container with resize handling so it never causes layout shift or overflow.
- `prefers-reduced-motion: reduce` disables the 3D scene (static fallback) and the chain-divider pulse/connector animations (render static state).
- Before calling the work done: run `npm run build` (catches type/SSR issues from the new client-only 3D component) and manually exercise the page in a running dev server across the breakpoints above, including hover/scroll-triggered animations.

## Out of scope

- No Prisma schema changes — all new visuals derive from existing fields (`color`, `tags`, etc.).
- No changes to `app/admin/**` admin UI.
- No changes to data-fetching logic in `app/page.tsx` beyond inserting `ChainDivider` components between sections.
