# Portfolio Deck — Full-Screen 3D Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio presentation layer into a PowerPoint-style full-screen deck with a persistent immersive three.js background, keeping all Prisma data and the admin area untouched.

**Architecture:** A `DeckProvider` React context owns slide state and a `deck | scroll` mode (derived from viewport width + `prefers-reduced-motion`). In `deck` mode a single `AnimatePresence` renders one fullscreen `<Slide>` at a time with 3D transform transitions, an input hook binds keyboard/wheel/touch, and a HUD renders progress + dot-nav. One fixed `<Canvas>` behind everything morphs a particle/line formation and lerps the camera per active slide. In `scroll` mode all slides stack with scroll-snap and the original `SiteNav`/`ChainDivider` return.

**Tech Stack:** Next.js 15 (App Router, RSC), React 19, TypeScript, Tailwind v4, framer-motion, three, @react-three/fiber. No new dependencies.

## Global Constraints

- No new npm dependencies. Use only: `framer-motion`, `motion`, `three`, `@react-three/fiber`, `lucide-react`, existing `components/ui/*`. GSAP is explicitly forbidden.
- Do NOT modify anything under `app/admin/**`, `prisma/**`, `lib/**`, or any Prisma model/schema/seed.
- Do NOT change the data props any section component consumes. Section components keep identical prop shapes.
- Import alias is `@/*` → repo root (e.g. `@/components/deck/deck-provider`).
- Palette tokens (verbatim): background `#0B1020`, card `#161D2F`, primary/electric-blue `#4F8CFF`, secondary/purple `#8B5CF6`, chain/crypto-green `#22E5A0`, success `#22C55E`. Fonts: `font-departure`, `font-jetbrains`, `font-ibm` (already defined).
- All new interactive components are Client Components (`"use client"`).
- Every task must respect `prefers-reduced-motion: reduce` where it adds motion.
- No unit-test runner exists in this repo. Each task's verification is a manual dev-server + browser check via `npm run dev` (http://localhost:3000). Type-safety gate each task: `npx tsc --noEmit` must pass.

**Slide order & indices (canonical, used by every task):**

| Index | Key | Component | Section id |
|-------|-----|-----------|-----------|
| 0 | `home` | Hero | `home` |
| 1 | `projects` | Projects | `projects` |
| 2 | `skills` | TechStack | `skills` |
| 3 | `experience` | WorkExperience | `experience` |
| 4 | `education` | Education | `education` |
| 5 | `certs` | Certification | `certs` |
| 6 | `contact` | Contact | `contact` |

`SLIDES` metadata array (index, key, label) is defined once in Task 1 and imported everywhere.

---

### Task 1: Deck state — DeckProvider context + SLIDES metadata

**Files:**
- Create: `components/deck/deck-types.ts`
- Create: `components/deck/deck-provider.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `deck-types.ts`: `export type DeckMode = "deck" | "scroll"`; `export type SlideMeta = { index: number; key: string; label: string }`; `export const SLIDES: SlideMeta[]` (7 entries per the canonical table, labels: Home, Projects, Skills, Experience, Education, Certifications, Contact).
  - `deck-provider.tsx`: `export function DeckProvider({ children }: { children: React.ReactNode }): JSX.Element`; `export function useDeck(): DeckContextValue` where
    ```ts
    type DeckContextValue = {
      activeIndex: number
      total: number
      mode: DeckMode
      isTransitioning: boolean
      direction: 1 | -1
      go: (dir: 1 | -1) => void
      goTo: (index: number) => void
      setTransitioning: (v: boolean) => void
    }
    ```
  - `mode` = `"deck"` when `window.matchMedia("(min-width: 1024px)").matches && window.matchMedia("(prefers-reduced-motion: no-preference)").matches`, else `"scroll"`. Defaults to `"scroll"` during SSR/first paint, recomputes in `useEffect` and on both media-query `change` events.
  - `go` clamps to `[0, total-1]` (no wrap), sets `direction`, sets `isTransitioning` true, updates `activeIndex`. `goTo` ignores same/out-of-range index, sets `direction` from sign of delta. `setTransitioning(false)` is called by the slide animation's `onAnimationComplete` (Task 4).

- [ ] **Step 1: Create the metadata/types file**

Create `components/deck/deck-types.ts`:
```ts
export type DeckMode = "deck" | "scroll"

export type SlideMeta = {
  index: number
  key: string
  label: string
}

export const SLIDES: SlideMeta[] = [
  { index: 0, key: "home", label: "Home" },
  { index: 1, key: "projects", label: "Projects" },
  { index: 2, key: "skills", label: "Skills" },
  { index: 3, key: "experience", label: "Experience" },
  { index: 4, key: "education", label: "Education" },
  { index: 5, key: "certs", label: "Certifications" },
  { index: 6, key: "contact", label: "Contact" },
]
```

- [ ] **Step 2: Create the provider**

Create `components/deck/deck-provider.tsx`:
```tsx
"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { SLIDES, type DeckMode } from "./deck-types"

type DeckContextValue = {
  activeIndex: number
  total: number
  mode: DeckMode
  isTransitioning: boolean
  direction: 1 | -1
  go: (dir: 1 | -1) => void
  goTo: (index: number) => void
  setTransitioning: (v: boolean) => void
}

const DeckContext = createContext<DeckContextValue | null>(null)

export function DeckProvider({ children }: { children: React.ReactNode }) {
  const total = SLIDES.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mode, setMode] = useState<DeckMode>("scroll")

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)")
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)")
    const compute = () => setMode(wide.matches && motionOk.matches ? "deck" : "scroll")
    compute()
    wide.addEventListener("change", compute)
    motionOk.addEventListener("change", compute)
    return () => {
      wide.removeEventListener("change", compute)
      motionOk.removeEventListener("change", compute)
    }
  }, [])

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((current) => {
        if (index < 0 || index >= total || index === current) return current
        setDirection(index > current ? 1 : -1)
        setIsTransitioning(true)
        return index
      })
    },
    [total]
  )

  const go = useCallback(
    (dir: 1 | -1) => {
      setActiveIndex((current) => {
        const next = current + dir
        if (next < 0 || next >= total) return current
        setDirection(dir)
        setIsTransitioning(true)
        return next
      })
    },
    [total]
  )

  const setTransitioning = useCallback((v: boolean) => setIsTransitioning(v), [])

  const value = useMemo<DeckContextValue>(
    () => ({ activeIndex, total, mode, isTransitioning, direction, go, goTo, setTransitioning }),
    [activeIndex, total, mode, isTransitioning, direction, go, goTo, setTransitioning]
  )

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
}

export function useDeck() {
  const ctx = useContext(DeckContext)
  if (!ctx) throw new Error("useDeck must be used within DeckProvider")
  return ctx
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS (no errors).

- [ ] **Step 4: Commit**

```bash
git add components/deck/deck-types.ts components/deck/deck-provider.tsx
git commit -m "feat(deck): add DeckProvider context and slide metadata"
```

---

### Task 2: Input hook — keyboard, wheel, touch → deck navigation

**Files:**
- Create: `components/deck/use-deck-input.ts`

**Interfaces:**
- Consumes: `useDeck()` from Task 1 (`go`, `goTo`, `mode`, `isTransitioning`, `activeIndex`, `total`).
- Produces: `export function useDeckInput(): void` — attaches window listeners; only active when `mode === "deck"`; no return value.

- [ ] **Step 1: Create the hook**

Create `components/deck/use-deck-input.ts`:
```ts
"use client"

import { useEffect, useRef } from "react"
import { useDeck } from "./deck-provider"

const WHEEL_THRESHOLD = 40
const COOLDOWN_MS = 700

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable
}

export function useDeckInput() {
  const { go, goTo, mode, isTransitioning, total } = useDeck()
  const lockedRef = useRef(false)
  const accumRef = useRef(0)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (mode !== "deck") return

    const unlockSoon = () => {
      window.setTimeout(() => {
        lockedRef.current = false
        accumRef.current = 0
      }, COOLDOWN_MS)
    }

    const trigger = (dir: 1 | -1) => {
      if (lockedRef.current || isTransitioning) return
      lockedRef.current = true
      go(dir)
      unlockSoon()
    }

    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault()
          trigger(1)
          break
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault()
          trigger(-1)
          break
        case "Home":
          e.preventDefault()
          goTo(0)
          break
        case "End":
          e.preventDefault()
          goTo(total - 1)
          break
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (lockedRef.current || isTransitioning) return
      accumRef.current += e.deltaY
      if (Math.abs(accumRef.current) < WHEEL_THRESHOLD) return
      trigger(accumRef.current > 0 ? 1 : -1)
    }

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      touchStartRef.current = { x: t.clientX, y: t.clientY }
    }

    const onTouchEnd = (e: TouchEvent) => {
      const start = touchStartRef.current
      if (!start) return
      const t = e.changedTouches[0]
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      touchStartRef.current = null
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return
      if (Math.abs(dy) >= Math.abs(dx)) trigger(dy < 0 ? 1 : -1)
      else trigger(dx < 0 ? 1 : -1)
    }

    window.addEventListener("keydown", onKey)
    window.addEventListener("wheel", onWheel, { passive: true })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [go, goTo, mode, isTransitioning, total])
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/deck/use-deck-input.ts
git commit -m "feat(deck): add keyboard/wheel/touch input hook"
```

---

### Task 3: Slide wrapper — fullscreen frame (deck) / passthrough (scroll)

**Files:**
- Create: `components/deck/slide.tsx`

**Interfaces:**
- Consumes: `useDeck()` (`mode`) from Task 1.
- Produces:
  ```ts
  export function Slide(props: {
    id: string
    mode: "deck" | "scroll"
    children: React.ReactNode
  }): JSX.Element
  ```
  In `deck` mode: a full-viewport (`h-[100dvh]`) flex-centered frame with an inner `overflow-y-auto` content column padded clear of HUD (top rail + right dot-nav). In `scroll` mode: a `<section>`-like wrapper carrying the `id` and `snap-start` for scroll-snap. `mode` is passed in explicitly (parent already read it) to keep this component pure/presentational.

- [ ] **Step 1: Create the wrapper**

Create `components/deck/slide.tsx`:
```tsx
"use client"

export function Slide({
  id,
  mode,
  children,
}: {
  id: string
  mode: "deck" | "scroll"
  children: React.ReactNode
}) {
  if (mode === "deck") {
    return (
      <section
        id={id}
        className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 w-full h-full overflow-y-auto overscroll-contain flex items-center justify-center px-5 md:px-10 py-20 pr-5 md:pr-24">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </div>
      </section>
    )
  }

  return (
    <section id={id} className="relative w-full snap-start scroll-mt-16">
      {children}
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/deck/slide.tsx
git commit -m "feat(deck): add Slide wrapper (fullscreen deck / scroll passthrough)"
```

---

### Task 4: Deck shell — orchestrate slides, transitions, both modes

**Files:**
- Create: `components/deck/deck.tsx`

**Interfaces:**
- Consumes: `useDeck`, `useDeckInput` (Task 2), `Slide` (Task 3), `SLIDES` (Task 1), `DeckHud` (Task 5 — added in Task 5's wiring; for THIS task render a placeholder-free version WITHOUT HUD/scene and integrate them in later tasks), section components.
- Produces:
  ```ts
  export type DeckSlides = {
    home: React.ReactNode
    projects: React.ReactNode
    skills: React.ReactNode
    experience: React.ReactNode
    education: React.ReactNode
    certs: React.ReactNode
    contact: React.ReactNode
  }
  export function Deck(props: { slides: DeckSlides }): JSX.Element
  ```
  `Deck` reads `mode`. In `deck` mode: binds input, renders exactly one slide via `AnimatePresence mode="popLayout"` keyed by `activeIndex`, with direction-aware 3D transform variants, and calls `setTransitioning(false)` in `onAnimationComplete`. In `scroll` mode: renders all 7 slides stacked in a `snap-y` scroll container.

Note: `Deck` must be rendered as a child of `DeckProvider`. Task 8 wires `DeckProvider` + `Deck` into `app/page.tsx`. HUD and 3D scene are layered in by Tasks 5 and 6 respectively (this task leaves clearly marked mount points).

- [ ] **Step 1: Create the deck shell**

Create `components/deck/deck.tsx`:
```tsx
"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useDeck } from "./deck-provider"
import { useDeckInput } from "./use-deck-input"
import { Slide } from "./slide"
import { SLIDES } from "./deck-types"

export type DeckSlides = {
  home: React.ReactNode
  projects: React.ReactNode
  skills: React.ReactNode
  experience: React.ReactNode
  education: React.ReactNode
  certs: React.ReactNode
  contact: React.ReactNode
}

export function Deck({ slides }: { slides: DeckSlides }) {
  const { mode, activeIndex, direction, setTransitioning } = useDeck()
  const reduce = useReducedMotion()
  useDeckInput()

  const nodeFor = (key: keyof DeckSlides) => slides[key]

  if (mode === "scroll") {
    return (
      <div className="relative">
        {/* MOUNT POINT: 3D scene (Task 6) + HUD (Task 5) layer above this in deck mode only */}
        {SLIDES.map((s) => (
          <Slide key={s.key} id={s.key} mode="scroll">
            {nodeFor(s.key as keyof DeckSlides)}
          </Slide>
        ))}
      </div>
    )
  }

  const current = SLIDES[activeIndex]
  const enterX = direction === 1 ? 120 : -120
  const exitX = direction === 1 ? -120 : 120

  const variants = reduce
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: { opacity: 0, x: enterX, rotateY: direction === 1 ? 35 : -35, z: -200 },
        center: { opacity: 1, x: 0, rotateY: 0, z: 0 },
        exit: { opacity: 0, x: exitX, rotateY: direction === 1 ? -35 : 35, z: -200 },
      }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ perspective: 1400 }}>
      {/* MOUNT POINT: 3D scene (Task 6) renders here, behind slides */}
      {/* MOUNT POINT: HUD (Task 5) renders here, above slides */}
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={current.key}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setTransitioning(false)}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          <Slide id={current.key} mode="deck">
            {nodeFor(current.key as keyof DeckSlides)}
          </Slide>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/deck/deck.tsx
git commit -m "feat(deck): add Deck shell with 3D slide transitions and scroll fallback"
```

---

### Task 5: HUD chrome — progress rail, counter, dot-nav, hint

**Files:**
- Create: `components/deck/deck-hud.tsx`
- Modify: `components/deck/deck.tsx` (mount HUD in deck mode)

**Interfaces:**
- Consumes: `useDeck` (`activeIndex`, `total`, `goTo`, `mode`), `SLIDES` (labels).
- Produces: `export function DeckHud(): JSX.Element | null` — returns `null` when `mode !== "deck"`. Renders fixed top progress rail + `NN / NN` counter, right vertical dot-nav (click → `goTo`, hover shows label), and a first-run hint chip that hides after `activeIndex` first becomes > 0.

- [ ] **Step 1: Create the HUD**

Create `components/deck/deck-hud.tsx`:
```tsx
"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useDeck } from "./deck-provider"
import { SLIDES } from "./deck-types"
import { cn } from "@/lib/utils"

const pad = (n: number) => String(n).padStart(2, "0")

export function DeckHud() {
  const { mode, activeIndex, total, goTo } = useDeck()
  const [hintGone, setHintGone] = useState(false)

  useEffect(() => {
    if (activeIndex > 0) setHintGone(true)
  }, [activeIndex])

  if (mode !== "deck") return null

  const progress = (activeIndex + 1) / total

  return (
    <>
      {/* Top progress rail */}
      <div className="fixed top-0 inset-x-0 z-50 h-[3px] bg-white/5">
        <motion.div
          className="h-full bg-linear-to-r from-[#4F8CFF] via-[#22E5A0] to-[#8B5CF6]"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Counter */}
      <div className="fixed top-5 left-6 z-50 font-departure text-xs tracking-widest text-white/70 select-none">
        <span className="text-white">{pad(activeIndex + 1)}</span>
        <span className="text-white/30"> / {pad(total)}</span>
      </div>

      {/* Right dot-nav */}
      <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-3">
        {SLIDES.map((s) => (
          <button
            key={s.key}
            onClick={() => goTo(s.index)}
            className="group flex items-center gap-2.5 cursor-pointer"
            aria-label={`Go to ${s.label}`}
          >
            <span
              className={cn(
                "text-[10px] font-ibm font-medium tracking-wide opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0",
                s.index === activeIndex ? "text-white" : "text-white/50"
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "rounded-full transition-all duration-300",
                s.index === activeIndex
                  ? "w-2.5 h-2.5 bg-[#22E5A0] shadow-[0_0_10px_rgba(34,229,160,0.6)]"
                  : "w-1.5 h-1.5 bg-white/25 group-hover:bg-white/50"
              )}
            />
          </button>
        ))}
      </nav>

      {/* First-run hint */}
      <AnimatePresence>
        {!hintGone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-[11px] font-ibm text-white/70"
          >
            <span className="text-[#4F8CFF]">◄ ►</span>
            <span>navigate · scroll · swipe</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cyberpunk corner brackets */}
      <div className="pointer-events-none fixed inset-0 z-40 deck-hud-corners" />
    </>
  )
}
```

- [ ] **Step 2: Mount HUD in the deck shell**

In `components/deck/deck.tsx`, add the import near the top with the other `./` imports:
```tsx
import { DeckHud } from "./deck-hud"
```
Then, in the `deck`-mode return, replace the HUD mount-point comment line:
```tsx
      {/* MOUNT POINT: HUD (Task 5) renders here, above slides */}
```
with:
```tsx
      <DeckHud />
```

- [ ] **Step 3: Add HUD utility styles**

In `app/globals.css`, append at the end of the file:
```css
@layer utilities {
  .deck-hud-corners::before,
  .deck-hud-corners::after {
    content: "";
    position: absolute;
    width: 28px;
    height: 28px;
    border-color: rgba(79, 140, 255, 0.35);
    border-style: solid;
  }
  .deck-hud-corners::before {
    top: 14px;
    left: 14px;
    border-width: 1px 0 0 1px;
  }
  .deck-hud-corners::after {
    bottom: 14px;
    right: 14px;
    border-width: 0 1px 1px 0;
  }
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/deck/deck-hud.tsx components/deck/deck.tsx app/globals.css
git commit -m "feat(deck): add HUD chrome (progress rail, counter, dot-nav, hint)"
```

---

### Task 6: Persistent 3D scene — morphing formation + per-slide camera

**Files:**
- Create: `components/deck/deck-scene.tsx`
- Create: `components/deck/deck-canvas.tsx`
- Modify: `components/deck/deck.tsx` (mount canvas behind slides, deck mode only)

**Interfaces:**
- Consumes: `useDeck` (`activeIndex`, `mode`). Reuses Fibonacci-sphere idea from existing `components/ui/node-network-scene.tsx` (copy the generator locally; do not import, to avoid coupling the hero widget).
- Produces:
  - `deck-scene.tsx`: `export function DeckScene({ activeIndex }: { activeIndex: number }): JSX.Element` — the R3F scene graph (points + lineSegments + lights) that lerps particle target positions and camera per `activeIndex` inside `useFrame`.
  - `deck-canvas.tsx`: `export default function DeckCanvas(): JSX.Element | null` — client wrapper: returns `null` when `mode !== "deck"`; renders a fixed `<Canvas>` with `DeckScene`, `dpr={[1, 1.5]}`, `frameloop` gated on tab visibility.

- [ ] **Step 1: Create the scene**

Create `components/deck/deck-scene.tsx`:
```tsx
"use client"

import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const COUNT = 90
const RADIUS = 3.2

// Formation generators — each returns COUNT vec3s.
function sphereFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    out.push(new THREE.Vector3(Math.cos(theta) * r * RADIUS, y * RADIUS, Math.sin(theta) * r * RADIUS))
  }
  return out
}

function gridFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  const per = Math.ceil(Math.sqrt(COUNT))
  for (let i = 0; i < COUNT; i++) {
    const gx = (i % per) - (per - 1) / 2
    const gy = Math.floor(i / per) - (per - 1) / 2
    out.push(new THREE.Vector3(gx * 0.9, gy * 0.9, Math.sin(i) * 0.4))
  }
  return out
}

function clusterFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  const centers = [
    new THREE.Vector3(-2.4, 1.2, 0),
    new THREE.Vector3(2.4, 1.0, -0.5),
    new THREE.Vector3(0, -1.8, 0.5),
    new THREE.Vector3(-1.5, -1.2, -1),
  ]
  for (let i = 0; i < COUNT; i++) {
    const c = centers[i % centers.length]
    out.push(
      c.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.6))
    )
  }
  return out
}

function chainFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  for (let i = 0; i < COUNT; i++) {
    const t = i / (COUNT - 1)
    const y = (0.5 - t) * 8
    out.push(new THREE.Vector3(Math.sin(t * Math.PI * 4) * 1.6, y, Math.cos(t * Math.PI * 4) * 1.6))
  }
  return out
}

function ringFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  for (let i = 0; i < COUNT; i++) {
    const ring = i % 3
    const a = (i / COUNT) * Math.PI * 2 * 3
    const rad = 1.6 + ring * 0.9
    out.push(new THREE.Vector3(Math.cos(a) * rad, (ring - 1) * 0.8, Math.sin(a) * rad))
  }
  return out
}

function fieldFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  for (let i = 0; i < COUNT; i++) {
    out.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 6))
  }
  return out
}

// Camera station per slide index [x,y,z].
const STATIONS: [number, number, number][] = [
  [0, 0, 8], // home
  [1.5, 0.5, 7], // projects
  [-1.5, 0.5, 7.5], // skills
  [0, 0, 9], // experience
  [1.2, -0.5, 7], // education
  [-1.2, 0.5, 6.5], // certs
  [0, 0, 11], // contact
]

export function DeckScene({ activeIndex }: { activeIndex: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  const formations = useMemo(
    () => [
      sphereFormation(),
      gridFormation(),
      clusterFormation(),
      chainFormation(),
      ringFormation(),
      clusterFormation(),
      fieldFormation(),
    ],
    []
  )

  // Live positions (start at sphere) + geometry buffer.
  const live = useMemo(() => formations[0].map((v) => v.clone()), [formations])
  const positions = useMemo(() => new Float32Array(COUNT * 3), [])
  const geomRef = useRef<THREE.BufferGeometry>(null)

  useFrame((state, delta) => {
    const target = formations[Math.min(activeIndex, formations.length - 1)]
    const damp = 1 - Math.pow(0.001, delta)
    for (let i = 0; i < COUNT; i++) {
      live[i].lerp(target[i], damp)
      positions[i * 3] = live[i].x
      positions[i * 3 + 1] = live[i].y
      positions[i * 3 + 2] = live[i].z
    }
    if (geomRef.current) {
      geomRef.current.attributes.position.needsUpdate = true
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
    const [cx, cy, cz] = STATIONS[Math.min(activeIndex, STATIONS.length - 1)]
    camera.position.x += (cx - camera.position.x) * damp
    camera.position.y += (cy - camera.position.y) * damp
    camera.position.z += (cz - camera.position.z) * damp
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#22E5A0" size={0.08} sizeAttenuation transparent opacity={0.85} />
      </points>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#8B5CF6" />
    </group>
  )
}
```

- [ ] **Step 2: Create the canvas wrapper**

Create `components/deck/deck-canvas.tsx`:
```tsx
"use client"

import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { useDeck } from "./deck-provider"
import { DeckScene } from "./deck-scene"

export default function DeckCanvas() {
  const { mode, activeIndex } = useDeck()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  if (mode !== "deck") return null

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 45 }}
        frameloop={visible ? "always" : "never"}
      >
        <DeckScene activeIndex={activeIndex} />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 3: Mount the canvas behind slides**

In `components/deck/deck.tsx`, add a dynamic import (SSR-safe) near the top, after the existing imports:
```tsx
import dynamic from "next/dynamic"

const DeckCanvas = dynamic(() => import("./deck-canvas"), { ssr: false })
```
Then in the `deck`-mode return, replace the scene mount-point comment:
```tsx
      {/* MOUNT POINT: 3D scene (Task 6) renders here, behind slides */}
```
with:
```tsx
      <DeckCanvas />
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/deck/deck-scene.tsx components/deck/deck-canvas.tsx components/deck/deck.tsx
git commit -m "feat(deck): add persistent morphing 3D background with per-slide camera"
```

---

### Task 7: Fullscreen restyle of section components (no data changes)

**Files:**
- Modify: `components/projects.tsx`, `components/tech-stack.tsx`, `components/work-experience.tsx`, `components/education.tsx`, `components/certification.tsx`, `components/contact.tsx`

**Interfaces:**
- Consumes: nothing new; props stay identical.
- Produces: nothing new; same exports/prop shapes. Only the outer wrapper className of each changes so the component fills a slide without its own tall vertical padding (the `<Slide>` now owns the viewport height and scroll).

Rationale: today each section is `py-16 md:py-24` inside a long scroll. In deck mode the `<Slide>` centers content and provides its own inner scroll; the big vertical section padding fights that. Reduce it to a self-contained block. In scroll mode this padding reduction is harmless (ChainDividers still separate sections — re-added in Task 8's scroll branch is not needed; Slide handles spacing). Keep `id` attributes intact — they match `SLIDES` keys and existing nav.

- [ ] **Step 1: Relax section vertical padding — Projects**

In `components/projects.tsx`, change the outer section (line ~38):
```tsx
    <section id="projects" className="relative py-16 md:py-24 font-jetbrains">
```
to:
```tsx
    <section id="projects" className="relative py-10 font-jetbrains w-full">
```

- [ ] **Step 2: Same for the other five sections**

Apply the identical transform (`py-16 md:py-24` → `py-10`, append ` w-full`) to the outer `<section className="relative py-16 md:py-24 font-jetbrains">` in each:
- `components/tech-stack.tsx` (`id="skills"`)
- `components/work-experience.tsx` (`id="experience"`)
- `components/education.tsx` (`id="education"`)
- `components/certification.tsx` (`id="certs"`)
- `components/contact.tsx` (`id="contact"`)

For each file the result line is:
```tsx
    <section id="<same-id>" className="relative py-10 font-jetbrains w-full">
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/projects.tsx components/tech-stack.tsx components/work-experience.tsx components/education.tsx components/certification.tsx components/contact.tsx
git commit -m "style(sections): relax vertical padding for fullscreen deck slides"
```

---

### Task 8: Wire the deck into the page (both modes) + ambient background

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `DeckProvider` (Task 1), `Deck` + `DeckSlides` (Task 4), all section components, existing Prisma fetch/mapping (unchanged).
- Produces: the rendered app. `app/page.tsx` stays a server component that fetches data, builds the mapped props exactly as today, then renders `<DeckProvider><Deck slides={{...}} /></DeckProvider>` inside the existing ambient-background wrapper. `SiteNav` is rendered ONLY in scroll mode — but since the server component can't read `mode`, wrap nav decision inside `Deck` is out of scope; instead keep `SiteNav` mounted (it's `fixed` and harmless in deck mode, where the HUD sits above it). Keep `ChainDivider`s out of the deck path (Slide owns spacing).

- [ ] **Step 1: Rewrite the page body to use the Deck**

In `app/page.tsx`, keep the entire `Home` data-fetching block (the `Promise.all`, `technologies`, `mappedProjects`, `earliestYear`, `yearsExperience`) exactly as-is. Replace ONLY the `return (...)` JSX with:
```tsx
  return (
    <div className="relative min-h-screen w-full bg-[#0B1020] text-foreground font-jetbrains overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-grid-subtle pointer-events-none z-0" />
      <div className="fixed inset-0 noise-overlay pointer-events-none z-0" />
      <div className="fixed top-[-300px] left-1/3 w-[600px] h-[600px] bg-[#4F8CFF]/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-200px] right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/6 rounded-full blur-[120px] pointer-events-none z-0" />

      <SiteNav name={profile?.name || "Ari Gunawan Jatmiko"} />

      <DeckProvider>
        <Deck
          slides={{
            home: profile ? (
              <Hero
                profile={profile}
                stats={{
                  yearsExperience,
                  projectsShipped: mappedProjects.length,
                  certifications: certifications.length,
                }}
              />
            ) : (
              <div />
            ),
            projects: <Projects projects={mappedProjects} />,
            skills: <TechStack technologies={technologies} />,
            experience: (
              <WorkExperience
                experiences={experiences.map((e) => ({
                  id: e.id,
                  position: e.position,
                  company: e.company,
                  duration: e.duration,
                  location: e.location,
                  description: e.description as string[],
                  skills: e.skills as string[],
                  images: (e.images as string[] | null) ?? [],
                  companyUrl: e.companyUrl ?? "#",
                  color: e.color,
                }))}
              />
            ),
            education: (
              <Education
                education={education.map((ed) => ({
                  id: ed.id,
                  degree: ed.degree,
                  institution: ed.institution,
                  duration: ed.duration,
                  location: ed.location,
                  description: ed.description,
                  achievements: ed.achievements as string[],
                  courses: ed.courses as string[],
                  images: (ed.images as string[] | null) ?? [],
                  thesis:
                    ed.thesisTitle || ed.thesisAdvisor || ed.thesisAbstract
                      ? {
                          title: ed.thesisTitle ?? "",
                          advisor: ed.thesisAdvisor ?? "",
                          abstract: ed.thesisAbstract ?? "",
                        }
                      : null,
                  color: ed.color,
                }))}
              />
            ),
            certs: (
              <Certification
                certifications={certifications.map((c) => ({
                  id: c.id,
                  name: c.name,
                  issuer: c.issuer,
                  date: c.date,
                  description: c.description,
                  credentialId: c.credentialId ?? "",
                  credentialUrl: c.credentialUrl ?? "#",
                  skills: c.skills as string[],
                  color: c.color,
                  icon: c.icon,
                }))}
              />
            ),
            contact: profile ? <Contact profile={profile} /> : <div />,
          }}
        />
      </DeckProvider>
    </div>
  )
```

- [ ] **Step 2: Update imports in `app/page.tsx`**

Remove the now-unused `ChainDivider` import. Add the deck imports. The import block becomes:
```tsx
import { prisma } from "@/lib/prisma"
import SiteNav from "@/components/site-nav"
import Hero from "@/components/hero"
import Projects from "@/components/projects"
import TechStack from "@/components/tech-stack"
import WorkExperience from "@/components/work-experience"
import Education from "@/components/education"
import Certification from "@/components/certification"
import Contact from "@/components/contact"
import { DeckProvider } from "@/components/deck/deck-provider"
import { Deck } from "@/components/deck/deck"
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Manual verification — desktop deck**

Run: `npm run dev`, open http://localhost:3000 on a ≥1024px window.
Expected:
- One fullscreen slide (Hero) visible, top rail shows `01 / 07`, right dot-nav present.
- ArrowRight / wheel-down / Space advances with a 3D flip; ArrowLeft goes back; rail + counter update; dot-nav click jumps; Home/End go to first/last.
- 3D background particles morph between formations and the camera shifts per slide.
- No horizontal scrollbar; tall slides (Projects, Experience) scroll inside the slide.

- [ ] **Step 5: Manual verification — scroll fallback**

Resize the browser below 1024px (or enable `prefers-reduced-motion` in devtools rendering) and reload.
Expected:
- All 7 sections stack in a normal vertical scroll with snap; no deck HUD; no 3D canvas (or lite); keyboard/wheel do not hijack navigation.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat(deck): wire DeckProvider + Deck into home page with scroll fallback"
```

---

### Task 9: Polish pass — reduced-motion, focus states, final QA

**Files:**
- Modify: `components/deck/deck-hud.tsx` (focus-visible rings on dot-nav)
- Modify: `app/globals.css` (scroll-mode snap container helper, reduced-motion guard for corners)

**Interfaces:**
- Consumes: everything above. Produces no new API.

- [ ] **Step 1: Add focus-visible rings to dot-nav buttons**

In `components/deck/deck-hud.tsx`, on the dot-nav `<button>`, extend its className to include keyboard focus visibility. Change:
```tsx
            className="group flex items-center gap-2.5 cursor-pointer"
```
to:
```tsx
            className="group flex items-center gap-2.5 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1020]"
```

- [ ] **Step 2: Reduced-motion guard for HUD corners + scroll-snap helper**

In `app/globals.css`, append:
```css
@media (prefers-reduced-motion: reduce) {
  .deck-hud-corners::before,
  .deck-hud-corners::after {
    display: none;
  }
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Full manual QA sweep**

Run: `npm run dev`. Verify against success criteria:
- Desktop deck: keyboard (←/→/↑/↓/Space/Home/End), wheel, swipe, dot-nav all navigate; one slide at a time; 3D flip transition ~600ms; no double-advance from a single wheel flick; ~60fps.
- Dot-nav reachable by Tab with a visible focus ring; Enter/Space activates.
- Mobile/reduced-motion: clean vertical scroll, lite/no 3D, no input hijack, no horizontal scroll.
- All data (projects, skills, experience, education, certs, contact) renders identically to before.
- `app/admin` still loads and is untouched (spot-check http://localhost:3000/admin/login).

- [ ] **Step 5: Commit**

```bash
git add components/deck/deck-hud.tsx app/globals.css
git commit -m "polish(deck): focus rings, reduced-motion guards, final QA"
```

---

## Self-Review

**Spec coverage:**
- DeckProvider + mode derivation → Task 1. ✓
- Input layer (keyboard/wheel/touch, lock) → Task 2. ✓
- Slide wrapper (deck frame / scroll passthrough, inner scroll) → Task 3. ✓
- Deck shell (AnimatePresence 3D transitions, both modes) → Task 4. ✓
- HUD (rail, counter, dot-nav, hint, corners) → Task 5. ✓
- Persistent morphing 3D + per-slide camera → Task 6. ✓
- Section fullscreen restyle (no data change) → Task 7. ✓
- Page wiring, data flow unchanged, admin untouched → Task 8. ✓
- Accessibility/reduced-motion/focus polish → Task 9. ✓

**Placeholder scan:** No TBD/TODO; all code shown in full. ✓

**Type consistency:** `useDeck()` shape defined in Task 1 is used consistently (`go`, `goTo`, `mode`, `isTransitioning`, `activeIndex`, `total`, `direction`, `setTransitioning`) across Tasks 2/4/5/6. `DeckScene({ activeIndex })` prop matches its call in Task 6 canvas. `Slide({ id, mode, children })` matches usage in Task 4. `DeckSlides` keys (home/projects/skills/experience/education/certs/contact) match `SLIDES` keys and the Task 8 `slides` object. ✓

**Known deviation from skill defaults:** This repo has no unit-test runner and the work is visual/animation; per-task verification is `npx tsc --noEmit` + a manual browser check instead of automated tests. This is intentional and noted in Global Constraints.
