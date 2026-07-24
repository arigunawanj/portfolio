# Portfolio Deck — Full-Screen 3D Presentation Rebuild

**Date:** 2026-07-24
**Status:** Approved (design)
**Context:** Total UI presentation rebuild for a blockchain hackathon. Turn the existing single-scroll portfolio into a PowerPoint-style full-screen deck with immersive three.js and rich interaction/animation. Data (Prisma) and admin remain untouched — this is a presentation-layer rebuild only.

## Decisions (locked)

- **Navigation:** Full-screen deck. Each section = one fullscreen slide. Keyboard / wheel / swipe / dot-nav. 3D slide transitions. Progress rail + `NN / NN` counter.
- **3D ambition:** Immersive full. One persistent three.js scene behind all content that morphs and moves the camera per slide.
- **Mobile / reduced-motion:** Desktop (≥lg, no reduced-motion) = deck + heavy 3D. Mobile or `prefers-reduced-motion` = normal scroll + lite/static 3D. Chosen for safe phone demo + accessibility.
- **Scope:** Presentation only. Keep Prisma data, schema, server fetch in `app/page.tsx`, and the entire `app/admin` area unchanged. Existing blockchain framing (dark `#0B1020`, chain dividers, on-chain labels) stays.
- **Dependencies:** No new required deps. `framer-motion`, `three`, `@react-three/fiber` already installed. GSAP intentionally NOT added — deck transitions are imperative/state-driven via framer-motion; camera motion uses `useFrame` damping.
- **Fonts:** Optional Orbitron/Exo 2 web3 display font. Deferred unless requested; existing DepartureMono/JetBrains/IBM Plex Mono stack is retained.

## Architecture

### DeckProvider (React context) — `components/deck/deck-provider.tsx`
Single source of truth for deck state.
- State: `activeIndex`, `total`, `mode` (`"deck" | "scroll"`), `isTransitioning`, `direction` (1 forward / -1 back).
- Actions: `go(dir)`, `goTo(index)`.
- `mode` derived from media queries: `deck` when viewport ≥ `lg` AND `prefers-reduced-motion: no-preference`; otherwise `scroll`. Recomputed on media-query change.
- `isTransitioning` lock prevents input during a transition; cleared on animation complete.
- Guards: `go` clamps at bounds (no wrap). `goTo` ignores same-index and out-of-range.

### Input layer — `components/deck/use-deck-input.ts`
Active only in `mode === "deck"`.
- Keyboard: ArrowRight/ArrowDown/Space/PageDown → next; ArrowLeft/ArrowUp/PageUp → prev; Home → first; End → last. `preventDefault` on handled keys. Ignore when focus is in an input/textarea/contenteditable.
- Wheel: accumulate delta, fire one step past a threshold, then lock until `isTransitioning` clears + small cooldown. Prevents multi-slide skips from inertial trackpads.
- Touch: swipe up/left → next, down/right → prev, past a min distance + velocity.
- All paths funnel through `go`/`goTo`; no-op while `isTransitioning`.

### Deck shell — `components/deck/deck.tsx`
- Renders persistent 3D scene (`deck-scene.tsx`) fixed behind, HUD chrome (`deck-hud.tsx`), and the active slide.
- `mode === "deck"`: `AnimatePresence mode="popLayout"` renders exactly one `<Slide>` keyed by `activeIndex`. Enter/exit variants = 3D transform (outgoing `rotateY` + z push-back + fade; incoming mirrored, direction-aware). ~600ms, `ease` cinematic. Reduced-motion (can occur if user toggles) → cross-fade only.
- `mode === "scroll"`: renders ALL slides stacked in a normal scroll container with scroll-snap; restores `SiteNav` and `ChainDivider` between sections; no deck input bound.

### Slide wrapper — `components/deck/slide.tsx`
- Deck mode: fixed full-viewport frame (`h-[100dvh]`), centers content, inner `overflow-y-auto` region for tall content (projects, experience) so nothing is clipped. HUD-safe padding (top rail, right dot-nav).
- Scroll mode: passthrough — renders children in normal document flow with section id + snap alignment.

### Persistent 3D scene — `components/deck/deck-scene.tsx`
One `<Canvas>` fixed behind everything (single GPU context). Reads `activeIndex` from context.
- Camera "stations": one target position/lookAt per slide; camera lerps toward the active station each frame (`useFrame`, damping — no GSAP).
- Particle/line formation morphs per slide (target positions lerped):

  | Index | Slide | 3D behavior |
  |-------|-------|-------------|
  | 0 | Hero | node-network globe (reuse existing generator), subtle mouse parallax |
  | 1 | Projects | globe → floating blocks grid |
  | 2 | Skills | blocks → clustered constellations (per tech category) |
  | 3 | Experience | constellation → vertical chain of linked blocks |
  | 4 | Education | chain → orbiting rings |
  | 5 | Certifications | rings → badge-like orbit |
  | 6 | Contact | camera pulls back, full field + accent glow |

- Perf: instanced points + `lineSegments`, `dpr={[1, 1.5]}`, `frameloop` pauses when tab hidden / not `deck` mode. Colors from existing palette (`#4F8CFF`, `#22E5A0`, `#8B5CF6`).
- Reuses `generateNodes` (Fibonacci sphere) logic from current `node-network-scene.tsx`.

### HUD chrome — `components/deck/deck-hud.tsx`
- Top: thin progress rail (width = `(activeIndex+1)/total`) + `03 / 07` counter in display font.
- Right: vertical dot-nav, one dot per slide, active enlarged, section label on hover (labels from existing nav link set). Click → `goTo`.
- First-run hint chip "◄ ► navigate", fades out after the first navigation.
- Cyberpunk HUD corner brackets + faint scanline overlay (CSS, respects reduced-motion).
- Resume download button retained (top-right, outside slide flow).

## Content slides (7)
Wrap EXISTING components unchanged in props/logic; light visual restyle for fullscreen breathing room only:
`Hero · Projects · TechStack · WorkExperience · Education · Certification · Contact`

Data continues to flow from `app/page.tsx` server fetch → `<Deck slides={...}>`. No component receives new/removed data props.

## Data flow (unchanged)
`app/page.tsx` (server component) fetches profile/projects/experience/education/certifications/techCategories via Prisma exactly as today, maps them as today, then passes the mapped data into `<Deck>` instead of laying out sections directly. DB, schema, seed, and `app/admin/**` are not touched.

## Files
**New**
- `components/deck/deck-provider.tsx`
- `components/deck/deck.tsx`
- `components/deck/slide.tsx`
- `components/deck/deck-hud.tsx`
- `components/deck/deck-scene.tsx`
- `components/deck/use-deck-input.ts`

**Edited**
- `app/page.tsx` — compose `<Deck>` with fetched data (keep all fetching/mapping).
- 7 section components — light fullscreen restyle only, no prop/logic change.
- `app/globals.css` — deck/HUD utilities (rail, corner brackets, scanline, scroll-snap), reduced-motion guards.

## Non-goals / YAGNI
- No GSAP, no new 3D asset pipeline, no route changes, no CMS/schema change.
- No per-slide deep-linking/URL hash in v1 (dot-nav + keyboard only). Can add later.
- Admin UI, auth, and Prisma models are out of scope.

## Risks & mitigations
- **3D perf on weaker GPUs:** single canvas, instancing, capped dpr, `frameloop` gating, and the mobile/reduced-motion path drops to lite/static (existing fallback in `node-network-canvas.tsx`).
- **Input feel (skipped/janky slides):** `isTransitioning` lock + wheel accumulation threshold + cooldown.
- **Tall content clipped in fullscreen:** inner scroll region inside `<Slide>` for Projects/Experience.
- **Accessibility:** keyboard-complete nav, visible focus, `prefers-reduced-motion` → scroll mode + cross-fade, contrast held to existing tokens.

## Success criteria
- Desktop: 7 fullscreen slides navigable by keyboard/wheel/swipe/dots with cinematic 3D transitions and a persistent morphing 3D background; ~60fps on a typical laptop.
- Mobile / reduced-motion: clean vertical scroll of the same content with lite 3D, no deck input, no horizontal scroll.
- All existing data renders correctly; admin and DB untouched.
