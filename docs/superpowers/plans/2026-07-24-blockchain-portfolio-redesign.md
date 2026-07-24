# Blockchain-Dev Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the portfolio's presentation layer (hero, section dividers, cards, nav) into a blockchain/network-motif aesthetic — dark glass cards with accent glow, a 3D node-network scene in the hero, and chain-link section dividers — without touching data models, admin UI, or content-fetching logic.

**Architecture:** Additive CSS tokens + a small set of new presentational components (`node-network-scene.tsx`, `node-network-canvas.tsx`, `chain-divider.tsx`, `lib/accent-colors.ts`, `lib/grid-connectors.ts`), then targeted restyling passes over existing section components (`hero.tsx`, `projects.tsx`, `work-experience.tsx`, `education.tsx`, `certification.tsx`, `contact.tsx`, `site-nav.tsx`) and `app/page.tsx` to wire the new divider between sections. The 3D scene is isolated behind `next/dynamic(..., { ssr: false })` so it never touches server rendering.

**Tech Stack:** Next.js 15 (App Router) / React 19 / Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`) / framer-motion / new deps: `three`, `@react-three/fiber`, `@react-three/drei`.

## Global Constraints

- Tailwind v4 is CSS-first — there is no `tailwind.config.js`. All new design tokens and utility classes are added directly to `app/globals.css` inside the existing `@theme` / `@layer base` / `@layer utilities` blocks, following the patterns already in that file.
- Do not change the existing `--primary` (`#4F8CFF`), `--secondary` (`#8B5CF6`), or `--background` (`#0B1020`) values — only add new tokens alongside them.
- New dependencies to install: `three@^0.185.0`, `@react-three/fiber@^9.6.1`, `@react-three/drei@^10.7.7`. These versions are confirmed compatible with the installed `react@19.0.0` / `react-dom@19.0.0` (fiber's peer range is `>=19 <19.3`).
- No Prisma schema changes. No changes under `app/admin/**`. No changes to data-fetching in `app/page.tsx` beyond inserting `<ChainDivider />` elements between sections.
- The `color` field on `Project`/`WorkExperience`/`Education`/`Certification` records (e.g. `"from-blue-500/20 to-cyan-500/20"`) is a dead Tailwind gradient-class fragment that is never rendered today. Do not attempt to interpolate it into Tailwind class names (breaks under JIT purge). New card accent glow instead cycles a fixed 3-color array from `lib/accent-colors.ts` by index.
- No test framework is installed in this repo (no jest/vitest, `package.json` has no `test` script). Verification for every task is: `npx tsc --noEmit` (must report no errors) plus a manual check in a running `npm run dev` server. The final task additionally runs `npm run build` and a full responsive/reduced-motion pass.
- Respect `prefers-reduced-motion: reduce` for every new animation (3D scene, chain-divider pulse, connector lines): reduced-motion users get a static equivalent, never a frozen mid-animation frame.

---

### Task 1: Design tokens + glass-panel utility

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: CSS custom properties `--chain`, `--chain-foreground`, `--glass-bg`, `--glass-border` (defined in `:root` and `.dark`); Tailwind theme colors `--color-chain`, `--color-chain-foreground` (defined in `@theme`); utility class `.glass-panel` (defined in `@layer utilities`).

- [ ] **Step 1: Add the new HSL tokens to `:root` and `.dark`**

In `app/globals.css`, inside the `:root { ... }` block (starts at the existing line with `--background: 226 50% 8%;`), add these two lines directly after `--ring: 219 100% 66%;` and before `--radius: 1rem;`:

```css
    --chain: 159 79% 52%; /* #22E5A0 (crypto cyan-green accent) */
    --chain-foreground: 210 20% 98%;
    --glass-bg: 223 36% 14% / 0.4;
    --glass-border: 220 20% 90% / 0.08;
```

Then, inside the `.dark { ... }` block (mirrors `:root`), add the same four lines directly after `--ring: 219 100% 66%;`:

```css
    --chain: 159 79% 52%;
    --chain-foreground: 210 20% 98%;
    --glass-bg: 223 36% 14% / 0.4;
    --glass-border: 220 20% 90% / 0.08;
```

- [ ] **Step 2: Register the Tailwind theme colors**

In the `@theme { ... }` block, directly after the existing:

```css
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
```

add:

```css
  --color-chain: hsl(var(--chain));
  --color-chain-foreground: hsl(var(--chain-foreground));
```

- [ ] **Step 3: Add the `.glass-panel` utility**

In the existing `@layer utilities { ... }` block (the one containing `.bg-grid-subtle`, `.noise-overlay`, `.terminal-cursor::after`), add:

```css
  /* Frosted glass surface for cards, nav, and panels */
  .glass-panel {
    background: hsl(var(--glass-bg));
    border: 1px solid hsl(var(--glass-border));
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0 (CSS changes don't affect TypeScript, this just confirms nothing else broke).

Run: `npm run dev` in the background, then in the browser open the dev tools console and run `getComputedStyle(document.documentElement).getPropertyValue('--chain')`.
Expected: returns `159 79% 52%`.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: add chain accent + glass-panel design tokens"
```

---

### Task 2: Accent color + grid connector helpers

**Files:**
- Create: `lib/accent-colors.ts`
- Create: `lib/grid-connectors.ts`

**Interfaces:**
- Produces: `ACCENT_COLORS: readonly string[]` and `getAccentColor(index: number): string` from `lib/accent-colors.ts`.
- Produces: `showRowConnector(index: number, totalItems: number, columns: number): boolean` from `lib/grid-connectors.ts`.
- Consumed by: Task 5 (hero badge), Tasks 8–11 (card glow + connectors).

- [ ] **Step 1: Create `lib/accent-colors.ts`**

```typescript
export const ACCENT_COLORS = ["#4F8CFF", "#8B5CF6", "#22E5A0"] as const

export function getAccentColor(index: number): string {
  return ACCENT_COLORS[index % ACCENT_COLORS.length]
}
```

- [ ] **Step 2: Create `lib/grid-connectors.ts`**

```typescript
/**
 * Whether a card at `index` in a CSS grid with `columns` columns should
 * render a connector line to its right-hand neighbor. False for the last
 * card in each row and for the very last item overall.
 */
export function showRowConnector(index: number, totalItems: number, columns: number): boolean {
  const isLastInRow = (index + 1) % columns === 0
  const isLastItem = index === totalItems - 1
  return !isLastInRow && !isLastItem
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add lib/accent-colors.ts lib/grid-connectors.ts
git commit -m "feat: add accent color and grid connector helpers"
```

---

### Task 3: Install Three.js deps + build the node-network 3D scene

**Files:**
- Modify: `package.json`, `package-lock.json` (via `npm install`)
- Create: `components/ui/node-network-scene.tsx`

**Interfaces:**
- Produces: default export `NodeNetworkScene()` — a React component that must be rendered as a child of an `@react-three/fiber` `<Canvas>`. Takes no props.
- Consumed by: Task 4 (`node-network-canvas.tsx`).

- [ ] **Step 1: Install dependencies**

Run: `npm install three@^0.185.0 @react-three/fiber@^9.6.1 @react-three/drei@^10.7.7`
Expected: exits 0, `package.json` `dependencies` now includes `three`, `@react-three/fiber`, `@react-three/drei`.

- [ ] **Step 2: Create the scene component**

```typescript
// components/ui/node-network-scene.tsx
"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const NODE_COUNT = 60
const CONNECT_DISTANCE = 2.6
const RADIUS = 3.2

function generateNodes(count: number, radius: number): THREE.Vector3[] {
  const positions: THREE.Vector3[] = []
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere distribution — even spread with no clustering at the poles
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r
    positions.push(new THREE.Vector3(x * radius, y * radius, z * radius))
  }
  return positions
}

export default function NodeNetworkScene() {
  const groupRef = useRef<THREE.Group>(null)

  const nodes = useMemo(() => generateNodes(NODE_COUNT, RADIUS), [])

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3)
    nodes.forEach((v, i) => {
      arr[i * 3] = v.x
      arr[i * 3 + 1] = v.y
      arr[i * 3 + 2] = v.z
    })
    return arr
  }, [nodes])

  const edgePositions = useMemo(() => {
    const points: number[] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < CONNECT_DISTANCE) {
          points.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z)
        }
      }
    }
    return new Float32Array(points)
  }, [nodes])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.08
    groupRef.current.rotation.x += delta * 0.015
  })

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#4F8CFF" transparent opacity={0.25} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#22E5A0" size={0.09} sizeAttenuation transparent opacity={0.9} />
      </points>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#8B5CF6" />
    </group>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0. (This file isn't imported anywhere yet, so this only checks it's syntactically/type valid in isolation via the project-wide check.)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json components/ui/node-network-scene.tsx
git commit -m "feat: add three.js deps and node-network 3D scene"
```

---

### Task 4: Node-network canvas wrapper (client-safe, perf-aware, reduced-motion)

**Files:**
- Create: `components/ui/node-network-canvas.tsx`

**Interfaces:**
- Consumes: default export `NodeNetworkScene` from `@/components/ui/node-network-scene` (Task 3).
- Produces: default export `NodeNetworkCanvas()` — a client component with no props, safe to render directly (handles its own reduced-motion + visibility logic internally). Renders a `<div className="absolute inset-0">` at its root so it can be dropped into any `position: relative` container.
- Consumed by: Task 5 (`hero.tsx`, via `next/dynamic`).

- [ ] **Step 1: Create the wrapper component**

```typescript
// components/ui/node-network-canvas.tsx
"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import NodeNetworkScene from "./node-network-scene"

function StaticFallback() {
  return (
    <div className="absolute inset-0 rounded-full bg-linear-to-tr from-[#4F8CFF]/20 via-[#22E5A0]/10 to-[#8B5CF6]/20 blur-2xl" />
  )
}

export default function NodeNetworkCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.1,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (reducedMotion) {
    return (
      <div ref={containerRef} className="absolute inset-0">
        <StaticFallback />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 45 }} frameloop={isVisible ? "always" : "never"}>
        <Suspense fallback={null}>
          <NodeNetworkScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add components/ui/node-network-canvas.tsx
git commit -m "feat: add node-network canvas wrapper with reduced-motion + visibility handling"
```

---

### Task 5: Integrate the 3D scene into Hero + add on-chain badge

**Files:**
- Modify: `components/hero.tsx`

**Interfaces:**
- Consumes: default export `NodeNetworkCanvas` from `@/components/ui/node-network-canvas` (Task 4, loaded via `next/dynamic`).

- [ ] **Step 1: Add the dynamic import**

In `components/hero.tsx`, add this import alongside the existing imports at the top of the file (after the `NumberTicker` import):

```typescript
import dynamic from "next/dynamic"

const NodeNetworkCanvas = dynamic(() => import("@/components/ui/node-network-canvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 rounded-full bg-linear-to-tr from-[#4F8CFF]/20 to-[#8B5CF6]/20 blur-2xl" />
  ),
})
```

- [ ] **Step 2: Replace the static gradient blur layer with the 3D scene**

Find this block (the first child of the photo column's `w-60 h-60 ...` container):

```tsx
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-[#4F8CFF]/20 to-[#8B5CF6]/20 blur-2xl" />
```

Replace it with:

```tsx
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <NodeNetworkCanvas />
            </div>
```

- [ ] **Step 3: Restyle the photo mount as a floating glass panel**

Find this block:

```tsx
            <div className="absolute inset-6 rounded-full overflow-hidden border-4 border-[#121826] bg-[#121826] shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative z-10">
```

Replace it with:

```tsx
            <div className="absolute inset-6 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm bg-[#121826]/70 shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative z-10">
```

- [ ] **Step 4: Add an "on-chain verified" badge next to the availability pill**

Find this block:

```tsx
          <div className="flex items-center gap-2 py-1.5 px-3.5 mt-5 bg-[#22C55E]/5 border border-[#22C55E]/15 rounded-lg w-fit">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[11px] font-bold text-[#22C55E] tracking-wider uppercase font-ibm">
              {profile.heroBadge || "Available for Opportunities"}
            </span>
          </div>
```

Replace it with:

```tsx
          <div className="flex flex-wrap items-center gap-2 pt-5">
            <div className="flex items-center gap-2 py-1.5 px-3.5 bg-[#22C55E]/5 border border-[#22C55E]/15 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[11px] font-bold text-[#22C55E] tracking-wider uppercase font-ibm">
                {profile.heroBadge || "Available for Opportunities"}
              </span>
            </div>
            <div className="flex items-center gap-2 py-1.5 px-3.5 bg-chain/5 border border-chain/20 rounded-lg w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-chain" />
              <span className="text-[11px] font-bold text-chain tracking-wider uppercase font-ibm">
                On-chain verified
              </span>
            </div>
          </div>
```

Note this also removes the old `mt-5` (now handled by the wrapping `pt-5` on the new flex row) — the spacing rhythm relative to the description paragraph above is preserved.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run `npm run dev`, open `http://localhost:3000` in a browser. Confirm:
- The hero's right-column circle now shows a rotating network of glowing points/lines instead of a flat gradient blob.
- The profile photo still renders correctly inside its ring.
- A green "On-chain verified" badge with pulsing chain-colored dot appears next to "Available for Opportunities".
- In devtools, emulate `prefers-reduced-motion: reduce` (Rendering tab → "Emulate CSS media feature prefers-reduced-motion") and reload — the 3D scene is replaced by a static gradient blur with no motion.

- [ ] **Step 6: Commit**

```bash
git add components/hero.tsx
git commit -m "feat: integrate 3D node-network scene and on-chain badge into hero"
```

---

### Task 6: Chain-link section divider

**Files:**
- Create: `components/ui/chain-divider.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: default export `ChainDivider()` — a presentational component with no props.
- Consumed by: Task 7 (`app/page.tsx`).

- [ ] **Step 1: Add the pulse keyframe to `app/globals.css`**

In the existing `@layer utilities { ... }` block, directly after the `.glass-panel` utility added in Task 1, add:

```css
  /* Chain-divider traveling glow pulse */
  @keyframes chain-pulse {
    0%,
    100% {
      opacity: 0;
      transform: scale(0.6);
    }
    50% {
      opacity: 1;
      transform: scale(1.4);
    }
  }
  .chain-divider-pulse {
    animation: chain-pulse 2.8s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .chain-divider-pulse {
      animation: none;
      opacity: 0.6;
    }
  }
```

- [ ] **Step 2: Create the divider component**

```typescript
// components/ui/chain-divider.tsx
const DOT_COUNT = 9

export default function ChainDivider() {
  return (
    <div className="relative py-2 select-none" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="relative h-6 flex items-center justify-center gap-6 md:gap-10">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent" />
          {Array.from({ length: DOT_COUNT }).map((_, i) => (
            <span key={i} className="relative w-1.5 h-1.5 rounded-full bg-white/15">
              <span
                className="absolute inset-0 rounded-full bg-chain chain-divider-pulse"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css components/ui/chain-divider.tsx
git commit -m "feat: add chain-link section divider component"
```

---

### Task 7: Insert dividers between sections

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: default export `ChainDivider` from `@/components/ui/chain-divider` (Task 6).

- [ ] **Step 1: Import `ChainDivider`**

In `app/page.tsx`, add to the imports (after the `Contact` import):

```typescript
import ChainDivider from "@/components/ui/chain-divider"
```

- [ ] **Step 2: Insert dividers between every top-level section inside `<main>`**

The current `<main>` block renders, in order: `Hero` (conditional), `Projects`, `TechStack`, `WorkExperience`, `Education`, `Certification`, `Contact` (conditional). Insert `<ChainDivider />` between each adjacent pair, so the block reads:

```tsx
      <main className="relative z-10">
        {profile && (
          <Hero
            profile={profile}
            stats={{
              yearsExperience,
              projectsShipped: mappedProjects.length,
              certifications: certifications.length,
            }}
          />
        )}
        <ChainDivider />
        <Projects projects={mappedProjects} />
        <ChainDivider />
        <TechStack technologies={technologies} />
        <ChainDivider />
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
        <ChainDivider />
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
        <ChainDivider />
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
        {profile && (
          <>
            <ChainDivider />
            <Contact profile={profile} />
          </>
        )}
      </main>
```

Note the divider before `Contact` is wrapped together with it in a fragment since `Contact` is conditionally rendered — this avoids a dangling divider when `profile` is null.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run `npm run dev`, load the homepage, scroll through it. Confirm a thin row of pulsing dots appears between every section, including right before Contact (only when a profile exists).

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: insert chain dividers between homepage sections"
```

---

### Task 8: Restyle Projects cards — glass panel, accent glow, row connectors

**Files:**
- Modify: `components/projects.tsx`

**Interfaces:**
- Consumes: `getAccentColor(index: number): string` from `@/lib/accent-colors` (Task 2), `showRowConnector(index, totalItems, columns): boolean` from `@/lib/grid-connectors` (Task 2).

- [ ] **Step 1: Import the helpers**

In `components/projects.tsx`, add after the existing `BentoGrid` import:

```typescript
import { getAccentColor } from "@/lib/accent-colors"
import { showRowConnector } from "@/lib/grid-connectors"
```

- [ ] **Step 2: Restyle the card wrapper and add the corner glow + connector**

Find the card's `motion.div` opening (inside the `projects.map` loop):

```tsx
              <motion.div
                key={project.id}
                initial={{ y: 16 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: Math.min(idx, 5) * 0.05 }}
                className="group flex flex-col rounded-xl border border-white/6 bg-[#161D2F]/40 hover:border-[#4F8CFF]/25 hover:bg-[#161D2F]/60 transition-all duration-300 overflow-hidden"
              >
```

Replace it with:

```tsx
              <motion.div
                key={project.id}
                initial={{ y: 16 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: Math.min(idx, 5) * 0.05 }}
                className="group relative flex flex-col rounded-xl glass-panel transition-all duration-300"
                style={{ borderColor: `${getAccentColor(idx)}22` }}
              >
                <div
                  className="absolute -top-1 -left-1 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-[2px]"
                  style={{ backgroundColor: getAccentColor(idx) }}
                />
                {showRowConnector(idx, projects.length, 3) && (
                  <div className="hidden lg:block absolute top-8 -right-3.5 z-10 w-3.5 h-px">
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(to right, ${getAccentColor(idx)}66, ${getAccentColor(idx + 1)}66)`,
                      }}
                    />
                    <span
                      className="absolute right-0 top-1/2 -translate-y-1/2 -mr-0.5 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: getAccentColor(idx + 1) }}
                    />
                  </div>
                )}
```

This changes the wrapper's border color from a static Tailwind hover class to an inline `style` driven by the accent index, and adds a hover corner glow dot plus the row connector. **The original wrapper's `overflow-hidden` class is dropped** — it would clip these two new elements, which are deliberately positioned with negative offsets outside the card's box. This is safe: the image section immediately inside the card already has its own `overflow-hidden rounded-t-lg` (see the `<div className="overflow-hidden rounded-t-lg group-hover:scale-[1.02] ...">` a few lines below), so the Safari screenshot's corner rounding and hover-zoom are still clipped correctly at that inner level — the outer `overflow-hidden` was redundant for that purpose. The closing `</motion.div>` for the card later in the file needs no change — the two new elements added here close themselves before the card's existing content continues.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run `npm run dev`, scroll to Projects. Confirm: cards have a frosted-glass look, hovering a card shows a small glowing dot at its top-left corner, and on a viewport ≥1024px wide there's a thin colored connector line between horizontally-adjacent cards (except the last card in each row and the final card overall).

- [ ] **Step 4: Commit**

```bash
git add components/projects.tsx
git commit -m "feat: restyle project cards with glass panel, accent glow, and row connectors"
```

---

### Task 9: Restyle Certification cards — glass panel, accent glow, row connectors

**Files:**
- Modify: `components/certification.tsx`

**Interfaces:**
- Consumes: `getAccentColor`, `showRowConnector` (same as Task 8).

- [ ] **Step 1: Import the helpers**

In `components/certification.tsx`, add after the `SectionHeader` import:

```typescript
import { getAccentColor } from "@/lib/accent-colors"
import { showRowConnector } from "@/lib/grid-connectors"
```

- [ ] **Step 2: Restyle the card wrapper**

Find:

```tsx
          <motion.div
            key={cert.id}
            initial={{ y: 14 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: Math.min(idx, 5) * 0.05 }}
            className="p-3.5 rounded-xl border border-white/4 bg-[#161D2F]/20 hover:bg-[#161D2F]/40 hover:border-white/10 transition-all duration-300 flex flex-col justify-between"
          >
```

Replace it with:

```tsx
          <motion.div
            key={cert.id}
            initial={{ y: 14 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: Math.min(idx, 5) * 0.05 }}
            className="group relative p-3.5 rounded-xl glass-panel transition-all duration-300 flex flex-col justify-between"
            style={{ borderColor: `${getAccentColor(idx)}22` }}
          >
            <div
              className="absolute -top-1 -left-1 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-[2px]"
              style={{ backgroundColor: getAccentColor(idx) }}
            />
            {showRowConnector(idx, certifications.length, 3) && (
              <div className="hidden lg:block absolute top-8 -right-2.5 z-10 w-2.5 h-px">
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(to right, ${getAccentColor(idx)}66, ${getAccentColor(idx + 1)}66)`,
                  }}
                />
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mr-0.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: getAccentColor(idx + 1) }}
                />
              </div>
            )}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run `npm run dev`, scroll to Certifications, confirm the same glass + glow + connector treatment as Projects.

- [ ] **Step 4: Commit**

```bash
git add components/certification.tsx
git commit -m "feat: restyle certification cards with glass panel and accent glow"
```

---

### Task 10: Restyle Work Experience + Education timeline cards

**Files:**
- Modify: `components/work-experience.tsx`
- Modify: `components/education.tsx`

**Interfaces:**
- Consumes: `getAccentColor` from `@/lib/accent-colors` (Task 2).

Note: these two sections are single-column vertical timelines (not multi-column grids), and already have a vertical rail + node-dot chain visual — no row connectors here (`showRowConnector` doesn't apply). This is a glass-panel + accent-glow-only pass.

- [ ] **Step 1: Import the helper in `work-experience.tsx`**

Add after the `SectionHeader` import:

```typescript
import { getAccentColor } from "@/lib/accent-colors"
```

- [ ] **Step 2: Restyle the expanded/collapsed card surface in `work-experience.tsx`**

Find:

```tsx
                  <div
                    className={cn(
                      "p-5 rounded-xl border transition-all duration-300",
                      isExpanded
                        ? "bg-[#161D2F] border-white/8 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                        : "border-white/5 bg-[#161D2F]/20 hover:bg-[#161D2F]/40 hover:border-white/10"
                    )}
                  >
```

Replace it with:

```tsx
                  <div
                    className={cn(
                      "p-5 rounded-xl glass-panel transition-all duration-300",
                      isExpanded ? "shadow-[0_10px_30px_rgba(0,0,0,0.25)]" : "hover:bg-[#161D2F]/40"
                    )}
                    style={{ borderColor: isExpanded ? `${getAccentColor(index)}55` : undefined }}
                  >
```

- [ ] **Step 3: Import the helper in `education.tsx`**

Add after the `SectionHeader` import:

```typescript
import { getAccentColor } from "@/lib/accent-colors"
```

- [ ] **Step 4: Restyle the expanded/collapsed card surface in `education.tsx`**

Find:

```tsx
                  <div
                    className={cn(
                      "p-5 rounded-xl border transition-all duration-300",
                      isExpanded
                        ? "bg-[#161D2F] border-white/8 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                        : "border-white/5 bg-[#161D2F]/20 hover:bg-[#161D2F]/40 hover:border-white/10"
                    )}
                  >
```

Replace it with:

```tsx
                  <div
                    className={cn(
                      "p-5 rounded-xl glass-panel transition-all duration-300",
                      isExpanded ? "shadow-[0_10px_30px_rgba(0,0,0,0.25)]" : "hover:bg-[#161D2F]/40"
                    )}
                    style={{ borderColor: isExpanded ? `${getAccentColor(idx)}55` : undefined }}
                  >
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run `npm run dev`, scroll to Experience and Education. Confirm both timelines now render glass-panel cards, and the currently-expanded card in each timeline shows an accent-colored border.

- [ ] **Step 6: Commit**

```bash
git add components/work-experience.tsx components/education.tsx
git commit -m "feat: restyle work-experience and education timeline cards with glass panel"
```

---

### Task 11: Restyle Contact connection cards + on-brand badge, and Nav glass treatment

**Files:**
- Modify: `components/contact.tsx`
- Modify: `components/site-nav.tsx`

**Interfaces:**
- Consumes: `getAccentColor` from `@/lib/accent-colors` (Task 2), in `contact.tsx` only.

- [ ] **Step 1: Import the helper in `contact.tsx`**

Add after the `SectionHeader` import:

```typescript
import { getAccentColor } from "@/lib/accent-colors"
```

- [ ] **Step 2: Restyle the connection link cards**

Find:

```tsx
              className="group flex items-center justify-between p-4 rounded-lg border border-white/6 bg-[#161D2F]/30 hover:bg-[#161D2F]/60 hover:border-[#4F8CFF]/25 transition-all duration-300"
```

Replace it with:

```tsx
              className="group relative flex items-center justify-between p-4 rounded-lg glass-panel hover:bg-[#161D2F]/60 transition-all duration-300"
              style={{ borderColor: `${getAccentColor(idx)}22` }}
```

(The `motion.a` this belongs to already has `idx` in scope from `connections.map((conn, idx) => ...)`.)

- [ ] **Step 3: Restyle the "READY FOR REMOTE / HYBRID" badge to use the chain accent**

Find:

```tsx
            <span className="font-bold text-[#22C55E]">READY FOR REMOTE / HYBRID</span>
```

Replace it with:

```tsx
            <span className="font-bold text-chain">READY FOR REMOTE / HYBRID</span>
```

- [ ] **Step 4: Apply glass-panel to the site nav header**

In `components/site-nav.tsx`, find:

```tsx
      className={cn(
        "fixed top-0 inset-x-0 z-50 font-jetbrains transition-all duration-300",
        scrolled
          ? "bg-[#0B1020]/85 backdrop-blur-xl border-b border-white/8 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          : "bg-transparent border-b border-transparent"
      )}
```

Replace it with:

```tsx
      className={cn(
        "fixed top-0 inset-x-0 z-50 font-jetbrains transition-all duration-300",
        scrolled
          ? "glass-panel border-b shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          : "bg-transparent border-b border-transparent"
      )}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run `npm run dev`. Confirm: Contact section's connection cards have the same glass treatment as other cards, the "READY FOR REMOTE / HYBRID" text is now the chain accent color, and scrolling the page shows the nav bar switch to a frosted-glass background once scrolled past the top.

- [ ] **Step 6: Commit**

```bash
git add components/contact.tsx components/site-nav.tsx
git commit -m "feat: restyle contact cards and nav with glass panel treatment"
```

---

### Task 12: Full responsive, reduced-motion, and build verification

**Files:** none (verification only)

- [ ] **Step 1: Type-check and build**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run build`
Expected: build completes successfully with no errors. Note: this requires a reachable `DATABASE_URL` for the Prisma-backed page data — if the build fails specifically on database connectivity (not on the new components), that's a pre-existing environment concern, not part of this redesign; confirm by checking the error is a Prisma/DB connection error rather than a TypeScript or React error in any file touched by this plan.

- [ ] **Step 2: Manual responsive pass**

Run `npm run dev`. In the browser, use devtools responsive mode to check each of these widths: 375px, 768px, 1024px, 1440px. At each width, scroll the full page and confirm:
- No horizontal scrollbar / overflow.
- Hero's 3D scene circle stays contained within its box, no layout shift.
- Project and certification card grids reflow correctly (1 col at 375/768 depending on breakpoint, up to 3 col at 1440) and row connectors only appear at ≥1024px.
- Chain dividers render as a single centered row of dots at every width, no wrapping.
- Nav collapses to the mobile menu below `lg` and the glass background still applies once scrolled.

- [ ] **Step 3: Manual reduced-motion pass**

In devtools, enable "Emulate CSS media feature prefers-reduced-motion: reduce" (Rendering tab) and reload the page. Confirm:
- Hero shows the static gradient fallback instead of the 3D scene.
- Chain dividers show static dim dots with no pulsing animation.

Turn the emulation back off afterward.

- [ ] **Step 4: Fix any issues found**

If any check in Steps 2–3 fails, fix it in the relevant component file from Tasks 1–11 and re-run the specific check that failed. Do not proceed to Step 5 until all checks pass.

- [ ] **Step 5: Final commit (only if fixes were made in Step 4)**

```bash
git add -A
git commit -m "fix: address responsive/reduced-motion issues from verification pass"
```

If Step 4 required no fixes, skip this commit — there's nothing new to record.
