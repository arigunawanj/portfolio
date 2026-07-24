# Portfolio 3D Redesign — Design Spec

**Date:** 2026-07-24
**Owner:** Ari Gunawan Jatmiko
**Branch target:** `feat/portfolio-deck-3d` (fresh build; prior deck deleted intentionally)

## Goal

Rebuild the public portfolio front page as a unique, developer-flavored, cinematic
scroll-driven 3D experience suitable for a hackathon introduction. Must be:
light-weight 3D (not heavy), responsive, interactive, readable, and driven by the
existing Prisma admin data. Add an admin "Appearance" panel to control theme/motion/3D.

Identity: Full Stack Web Developer, currently learning Blockchain / Web3.

## Non-Goals

- No game-world / WASD navigation (chose cinematic scroll).
- No rewrite of existing admin CRUD (Profile, Projects, Tech, Experience, Education,
  Certifications, About). Only ADD an Appearance panel.
- No change to database provider (stays MySQL / Prisma).

## Decisions (locked)

| Topic | Decision |
|-------|----------|
| Starting point | Fresh 3D layer. Old `page.tsx` + section components already deleted. Keep Prisma data layer. |
| Interaction model | Cinematic scroll (GSAP ScrollTrigger scrubbing). |
| Palette | Deep Teal + Coral (muted "paten" tones). |
| 3D motif | Morphing blockchain node-network (instanced nodes + links). |
| Sections | Pitch 5: Hero → Tech → Projects → Experience → Contact. About/Education/Certs folded in compactly. |
| Admin | Front page + new admin Appearance panel (palette, motion, 3D toggle). Schema migration required. |

## Stack Additions

- `gsap` (with ScrollTrigger) — scroll scrubbing.
- `@react-three/drei` — perf helpers (AdaptiveDpr, Preload, instancing helpers).
- Keep existing: `@react-three/fiber`, `three`, `next 15`, `react 19`, `framer-motion`.
- Add one warm heading font (Space Grotesk) alongside existing mono fonts.

## Architecture

```
app/page.tsx (server component)
  ├─ prisma fetch: SiteProfile, Project[], TechCategory+skills,
  │                WorkExperience[], Education[], Certification[],
  │                AboutTrait[], FunFact[], Appearance(singleton)
  └─ renders <Portfolio3D data={...} appearance={...} />  (client)

components/portfolio/
  portfolio-3d.tsx        # top client orchestrator: sets CSS vars from Appearance, gates 3D
  scene-canvas.tsx        # dynamic(ssr:false) single fixed <Canvas>; AdaptiveDpr; mobile downscale
  node-network.tsx        # instanced node+link mesh; GSAP-driven morph uniforms; mouse parallax
  scroll-timeline.ts      # GSAP ScrollTrigger setup, scene registration, reduced-motion guard
  hud.tsx                 # progress rail + section nav + counter (z20)
  sections/
    hero.tsx
    tech.tsx
    projects.tsx
    experience.tsx
    contact.tsx
```

### Layering (z-index)

- `z0` — fixed 3D `<Canvas>` backdrop.
- `z10` — scroll content: real HTML/DOM text (SSR'd, accessible, crisp).
- `z20` — HUD chrome.

3D is a **backdrop**; all copy is DOM text. This is what keeps it both light and readable.

## Performance Strategy ("3D tidak berat")

- Single persistent `<Canvas>`, `dpr={[1, 1.5]}`, `<AdaptiveDpr>` lowers res during scroll.
- ONE instanced geometry for the whole network (not N meshes). ~200–400 nodes desktop,
  ~80 mobile. Links via instanced lines / line segments.
- Morph per scene by animating shader/material uniforms + instance positions with GSAP —
  no geometry rebuilds.
- Lazy-load Three via `next/dynamic({ ssr:false })`. Content HTML renders immediately.
- Mobile detection → fewer nodes + simpler material.
- Gates that fully disable 3D (render static CSS gradient instead):
  - `prefers-reduced-motion: reduce`
  - Appearance.enable3D === false
  - Appearance.motionLevel === "off"

## Theme Tokens

```
--bg-deep:    #0F2A2E   deep teal base (not black)
--bg-panel:   #16383C   raised surface
--teal:       #2A6F74   primary structural
--teal-glow:  #3E9B94   node network glow
--coral:      #E8785B   primary accent / CTA
--coral-soft: #F0A48C   hover / highlight
--sand:       #E8D9C0   warm headings
--cream:      #F4EEE3   body text
--muted-fg:   #9DB3B0   secondary text
```

- Cream/sand text on deep-teal meets WCAG AA. Coral reserved for accents/CTA only.
- Typography: Space Grotesk (headings) + JetBrains Mono (labels/code identity).
- `accentColor` from Appearance overrides `--coral` at runtime.

## 3D Motif — Morph States

Network re-forms per scene via GSAP scrub:

| Scene | Network shape |
|-------|---------------|
| Hero | loose galaxy cloud |
| Tech | structured grid lattice |
| Projects | tight clusters (one per project) |
| Experience | vertical timeline chain |
| Contact | converge to single glowing token / chain-link |

Idle: slow drift + mouse parallax (tilts toward cursor). Occasional coral "transaction"
pulses travel along links (Web3 nod).

## Scroll Scenes (Pitch 5)

One GSAP ScrollTrigger master timeline with pinned segments.

1. **Hero** — name, role, heroBadge, heroDescription; `photoUrl` in floating framed card
   that tilts on mouse-move (parallax). Coral CTA buttons → Projects / Contact.
2. **Tech Stack** — `TechCategory` + `TechSkill` as bars/nodes, scrub reveals categories
   left→right. `AboutTrait` + `FunFact` folded into a compact side strip.
3. **Projects** (star) — horizontal scrub through `Project` cards: image carousel, tags,
   features, demo/github links. Click → dialog with `fullDescription`. Network clusters.
4. **Experience** — vertical timeline chain from `WorkExperience`. `Education` + `Certification`
   as compact stacked cards below.
5. **Contact** — socials + email from `SiteProfile`; network converges to token. Footer.

All scenes: hover-lift cards, coral focus rings, scrubbed reveals. Reduced-motion → snap
reveals, static network.

## Admin: Appearance Panel

New singleton Prisma model:

```prisma
model Appearance {
  id          Int      @id @default(1)
  palette     String   @default("teal-coral")
  motionLevel String   @default("full")   // full | reduced | off
  enable3D    Boolean  @default(true)
  accentColor String   @default("#E8785B")
  headingFont String   @default("Space Grotesk")
  updatedAt   DateTime @updatedAt
}
```

- New route `app/admin/(dashboard)/appearance/page.tsx` + client form, mirroring the
  existing `profile/` pattern.
- New server action `app/admin/actions/appearance.ts` (get + upsert singleton id=1).
- Seed: ensure row id=1 exists (`prisma/seed.ts` addition).
- Front page reads Appearance; missing row → hardcoded defaults (no crash).

## Data Contracts

Front page maps Prisma rows to plain props (JSON fields cast): Project.images/tags/features
as `string[]`; WorkExperience.description/skills, Education.achievements/courses,
Certification.skills likewise. Same mapping pattern already used in prior `page.tsx`.

## Error Handling

- Any Prisma fetch returns empty → section renders graceful empty state, no throw.
- Appearance missing → defaults.
- Three fails / WebGL unavailable → catch → static gradient backdrop; content unaffected.

## Testing

- Manual: dev run; verify each of 5 scenes; mobile viewport (~375px); `prefers-reduced-motion`;
  Appearance 3D-off toggle; accentColor change reflects live.
- Build: `pnpm build` (runs `prisma generate && next build`) passes.
- Perf target: Lighthouse mobile perf ≥ 70; no CLS (content SSR'd).
- Accessibility: keyboard nav through sections, focus rings visible, text contrast AA.

## Rollout / Migration

1. Add deps.
2. Add Appearance model → `prisma db push` (dev) + seed row.
3. Build front page + 3D layer.
4. Build admin Appearance panel.
5. QA passes → commit on `feat/portfolio-deck-3d`.

## Open Risks

- GSAP + R3F scroll sync on mobile can jank → mitigate with AdaptiveDpr + node caps + fallback.
- Instanced morph math is the trickiest part → build node-network in isolation first.
