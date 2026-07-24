# Portfolio 3D Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public portfolio front page as a lightweight, responsive, cinematic scroll-driven 3D experience (GSAP ScrollTrigger + React Three Fiber) driven by existing Prisma data, plus an admin Appearance panel controlling palette/motion/3D.

**Architecture:** `app/page.tsx` (server) fetches all Prisma data + Appearance singleton, passes plain props to a client `<Portfolio3D>`. A single fixed R3F `<Canvas>` renders an instanced blockchain node-network backdrop (z0); DOM section content (z10) is SSR'd and crisp; HUD chrome (z20). GSAP ScrollTrigger scrubs a master timeline that morphs the network per scene. Admin gains an Appearance singleton model + panel mirroring the existing `profile/` pattern.

**Tech Stack:** Next 15 (App Router, RSC), React 19, Prisma 6 (MySQL), Tailwind v4, `@react-three/fiber` + `three` (installed), NEW: `gsap`, `@react-three/drei`, Space Grotesk font.

## Global Constraints

- Package manager: use `pnpm` (repo uses pnpm-lock).
- 3D must be gated OFF (render static CSS gradient) when ANY of: `prefers-reduced-motion: reduce`, `Appearance.enable3D === false`, `Appearance.motionLevel === "off"`.
- All section copy is real DOM text (SSR'd), never rendered inside the canvas — keeps it readable + accessible + SEO.
- Palette tokens exact: `--bg-deep:#0F2A2E --bg-panel:#16383C --teal:#2A6F74 --teal-glow:#3E9B94 --coral:#E8785B --coral-soft:#F0A48C --sand:#E8D9C0 --cream:#F4EEE3 --muted-fg:#9DB3B0`.
- `Appearance.accentColor` overrides `--coral` at runtime.
- Node caps: ~300 desktop / ~80 mobile. One instanced geometry for the whole network.
- Three loaded via `next/dynamic({ ssr:false })`. WebGL failure → static gradient, content unaffected.
- Missing Appearance row → hardcoded defaults, never throw.
- Name on site: "Ari Gunawan Jatmiko". Identity: Full Stack Web Developer learning Blockchain/Web3.
- Sections (Pitch 5): Hero → Tech → Projects → Experience → Contact. About/Education/Certs folded in compactly.

---

## File Structure

```
prisma/schema.prisma                         # + Appearance model
prisma/seed.ts                               # + Appearance upsert id=1
app/globals.css                              # + teal/coral tokens, heading font
app/page.tsx                                 # server: fetch + map + render <Portfolio3D>
lib/portfolio-data.ts                        # NEW: types + mapPrismaToProps() (pure, unit-tested)
components/portfolio/portfolio-3d.tsx        # client orchestrator, CSS vars, 3D gate
components/portfolio/scene-canvas.tsx        # dynamic(ssr:false) Canvas wrapper
components/portfolio/node-network.tsx        # instanced node+link mesh + mouse parallax
components/portfolio/use-scroll-timeline.ts  # GSAP ScrollTrigger master timeline hook
components/portfolio/hud.tsx                  # progress rail + nav + counter
components/portfolio/sections/hero.tsx
components/portfolio/sections/tech.tsx
components/portfolio/sections/projects.tsx
components/portfolio/sections/experience.tsx
components/portfolio/sections/contact.tsx
app/admin/actions/appearance.ts              # NEW: getAppearance + updateAppearance
app/admin/(dashboard)/appearance/page.tsx    # NEW: server page
app/admin/(dashboard)/appearance/appearance-client.tsx  # NEW: form
components/admin/sidebar.tsx                  # + Appearance nav item
```

---

## Task 1: Dependencies + theme tokens + heading font

**Files:**
- Modify: `package.json` (via pnpm add)
- Modify: `app/globals.css` (font import ~line 1, tokens in `@theme` / `:root`)

**Interfaces:**
- Produces: CSS vars `--bg-deep,--bg-panel,--teal,--teal-glow,--coral,--coral-soft,--sand,--cream,--muted-fg` available globally; `--font-space-grotesk`; deps `gsap`, `@react-three/drei` installed.

- [ ] **Step 1: Install deps**

Run:
```bash
pnpm add gsap @react-three/drei
```
Expected: added to `package.json` dependencies, no peer errors (drei matches fiber v9 / three 0.185).

- [ ] **Step 2: Add Space Grotesk to font import**

In `app/globals.css` line 1, extend the Google Fonts `@import url(...)` query to add `Space+Grotesk:wght@400;500;600;700` (append `&family=Space+Grotesk:wght@400;500;600;700` before `&display=swap`).

- [ ] **Step 3: Add palette tokens**

Append to `app/globals.css` (after existing `@theme` block, at end of file):
```css
:root {
  --pf-bg-deep: #0F2A2E;
  --pf-bg-panel: #16383C;
  --pf-teal: #2A6F74;
  --pf-teal-glow: #3E9B94;
  --pf-coral: #E8785B;
  --pf-coral-soft: #F0A48C;
  --pf-sand: #E8D9C0;
  --pf-cream: #F4EEE3;
  --pf-muted-fg: #9DB3B0;
  --pf-heading-font: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
}
.font-heading { font-family: var(--pf-heading-font); }
```

- [ ] **Step 4: Verify build compiles**

Run: `pnpm build`
Expected: PASS (prisma generate + next build succeed). If DB unreachable during build, that is a pre-existing env issue — confirm CSS/deps compile via `pnpm exec next lint` instead.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml app/globals.css
git commit -m "chore(portfolio): add gsap+drei deps, teal/coral tokens, heading font"
```

---

## Task 2: Appearance model + seed + server action

**Files:**
- Modify: `prisma/schema.prisma` (add model)
- Modify: `prisma/seed.ts` (upsert row id=1)
- Create: `app/admin/actions/appearance.ts`

**Interfaces:**
- Produces:
  - Prisma model `Appearance { id:Int=1, palette:String, motionLevel:String, enable3D:Boolean, accentColor:String, headingFont:String, updatedAt }`.
  - `getAppearance(): Promise<Appearance>` — returns row id=1 or in-memory defaults object `{ id:1, palette:"teal-coral", motionLevel:"full", enable3D:true, accentColor:"#E8785B", headingFont:"Space Grotesk" }`.
  - `updateAppearance(formData: FormData): Promise<void>` — upserts id=1, revalidates `/` and `/admin/appearance`.

- [ ] **Step 1: Add model to schema**

Append to `prisma/schema.prisma`:
```prisma
model Appearance {
  id          Int      @id @default(1)
  palette     String   @default("teal-coral")
  motionLevel String   @default("full")
  enable3D    Boolean  @default(true)
  accentColor String   @default("#E8785B")
  headingFont String   @default("Space Grotesk")
  updatedAt   DateTime @updatedAt
}
```

- [ ] **Step 2: Push schema + generate client**

Run: `pnpm db:push`
Expected: `Appearance` table created; `prisma generate` runs. (If no DB, run `pnpm exec prisma generate` so the client type exists for typechecking.)

- [ ] **Step 3: Seed the singleton row**

In `prisma/seed.ts`, before the final disconnect, add:
```ts
await prisma.appearance.upsert({
  where: { id: 1 },
  update: {},
  create: { id: 1 },
})
```

- [ ] **Step 4: Write the action**

Create `app/admin/actions/appearance.ts`:
```ts
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const APPEARANCE_DEFAULTS = {
  id: 1,
  palette: "teal-coral",
  motionLevel: "full",
  enable3D: true,
  accentColor: "#E8785B",
  headingFont: "Space Grotesk",
}

export async function getAppearance() {
  try {
    const row = await prisma.appearance.findUnique({ where: { id: 1 } })
    return row ?? APPEARANCE_DEFAULTS
  } catch {
    return APPEARANCE_DEFAULTS
  }
}

export async function updateAppearance(formData: FormData) {
  const data = {
    palette: String(formData.get("palette") ?? "teal-coral"),
    motionLevel: String(formData.get("motionLevel") ?? "full"),
    enable3D: formData.get("enable3D") === "on" || formData.get("enable3D") === "true",
    accentColor: String(formData.get("accentColor") ?? "#E8785B"),
    headingFont: String(formData.get("headingFont") ?? "Space Grotesk"),
  }
  await prisma.appearance.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  })
  revalidatePath("/")
  revalidatePath("/admin/appearance")
}
```

- [ ] **Step 5: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS (no errors referencing `prisma.appearance`).

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma prisma/seed.ts app/admin/actions/appearance.ts
git commit -m "feat(admin): add Appearance model, seed, and server action"
```

---

## Task 3: Data mapping layer (pure, unit-tested)

**Files:**
- Create: `lib/portfolio-data.ts`
- Create: `lib/portfolio-data.test.ts`

**Interfaces:**
- Consumes: raw Prisma row shapes.
- Produces:
  - Types: `ProjectVM, TechCategoryVM, ExperienceVM, EducationVM, CertVM, AboutTraitVM, ContactVM, PortfolioData`.
  - `mapPortfolioData(raw): PortfolioData` — casts JSON fields to arrays, provides `#`/`[]` fallbacks. Pure function, no Prisma import.

- [ ] **Step 1: Write the failing test**

Create `lib/portfolio-data.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { mapPortfolioData } from "./portfolio-data"

describe("mapPortfolioData", () => {
  it("casts JSON fields to arrays and applies link fallbacks", () => {
    const out = mapPortfolioData({
      profile: null,
      projects: [{
        id: 1, title: "P", shortDescription: "s", description: "d",
        fullDescription: "f", images: ["a.jpg"], tags: ["ts"], features: ["x"],
        demoLink: null, githubLink: null, color: "c",
      }],
      techCategories: [{ key: "fe", icon: "i", title: "FE", description: "d",
        skills: [{ name: "React", level: 90 }] }],
      experiences: [], education: [], certifications: [], aboutTraits: [], funFacts: [],
    } as any)

    expect(out.projects[0].images).toEqual(["a.jpg"])
    expect(out.projects[0].demoLink).toBe("#")
    expect(out.tech[0].skills[0].name).toBe("React")
    expect(out.contact.email).toBe("")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run lib/portfolio-data.test.ts`
Expected: FAIL — "Cannot find module './portfolio-data'". (If vitest not installed, run `pnpm add -D vitest` first, then re-run.)

- [ ] **Step 3: Write minimal implementation**

Create `lib/portfolio-data.ts`:
```ts
export type SkillVM = { name: string; level: number }
export type TechCategoryVM = { key: string; icon: string; title: string; description: string; skills: SkillVM[] }
export type ProjectVM = {
  id: number; title: string; shortDescription: string; description: string
  fullDescription: string; images: string[]; tags: string[]; features: string[]
  demoLink: string; githubLink: string; color: string
}
export type ExperienceVM = {
  position: string; company: string; duration: string; location: string
  description: string[]; skills: string[]; companyUrl: string | null; color: string
}
export type EducationVM = {
  degree: string; institution: string; duration: string; location: string
  description: string; achievements: string[]; courses: string[]; color: string
}
export type CertVM = { name: string; issuer: string; date: string; description: string; credentialUrl: string | null; skills: string[]; icon: string; color: string }
export type AboutTraitVM = { category: string; icon: string; title: string; description: string }
export type ContactVM = {
  name: string; role: string; heroBadge: string; heroDescription: string; photoUrl: string
  email: string; phone: string | null; location: string | null
  githubUrl: string | null; linkedinUrl: string | null; instagramUrl: string | null
  gitlabUrl: string | null; twitterUrl: string | null
}
export type PortfolioData = {
  contact: ContactVM
  tech: TechCategoryVM[]
  projects: ProjectVM[]
  experiences: ExperienceVM[]
  education: EducationVM[]
  certifications: CertVM[]
  aboutTraits: AboutTraitVM[]
  funFacts: string[]
}

const arr = (v: unknown): any[] => (Array.isArray(v) ? v : [])
const str = (v: unknown): string => (typeof v === "string" ? v : "")

export function mapPortfolioData(raw: any): PortfolioData {
  const p = raw.profile
  return {
    contact: {
      name: p?.name ?? "Ari Gunawan Jatmiko",
      role: p?.role ?? "Full Stack Web Developer",
      heroBadge: p?.heroBadge ?? "",
      heroDescription: p?.heroDescription ?? "",
      photoUrl: p?.photoUrl ?? "/foto/10.jpg",
      email: p?.email ?? "",
      phone: p?.phone ?? null,
      location: p?.location ?? null,
      githubUrl: p?.githubUrl ?? null,
      linkedinUrl: p?.linkedinUrl ?? null,
      instagramUrl: p?.instagramUrl ?? null,
      gitlabUrl: p?.gitlabUrl ?? null,
      twitterUrl: p?.twitterUrl ?? null,
    },
    tech: arr(raw.techCategories).map((c: any) => ({
      key: c.key, icon: c.icon, title: c.title, description: c.description,
      skills: arr(c.skills).map((s: any) => ({ name: s.name, level: s.level })),
    })),
    projects: arr(raw.projects).map((p: any) => ({
      id: p.id, title: p.title, shortDescription: p.shortDescription, description: p.description,
      fullDescription: p.fullDescription, images: arr(p.images), tags: arr(p.tags), features: arr(p.features),
      demoLink: p.demoLink || "#", githubLink: p.githubLink || "#", color: p.color,
    })),
    experiences: arr(raw.experiences).map((e: any) => ({
      position: e.position, company: e.company, duration: e.duration, location: e.location,
      description: arr(e.description), skills: arr(e.skills), companyUrl: e.companyUrl ?? null, color: e.color,
    })),
    education: arr(raw.education).map((e: any) => ({
      degree: e.degree, institution: e.institution, duration: e.duration, location: e.location,
      description: str(e.description), achievements: arr(e.achievements), courses: arr(e.courses), color: e.color,
    })),
    certifications: arr(raw.certifications).map((c: any) => ({
      name: c.name, issuer: c.issuer, date: c.date, description: c.description,
      credentialUrl: c.credentialUrl ?? null, skills: arr(c.skills), icon: c.icon, color: c.color,
    })),
    aboutTraits: arr(raw.aboutTraits).map((t: any) => ({
      category: String(t.category), icon: t.icon, title: t.title, description: t.description,
    })),
    funFacts: arr(raw.funFacts).map((f: any) => str(f.text)),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run lib/portfolio-data.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/portfolio-data.ts lib/portfolio-data.test.ts package.json pnpm-lock.yaml
git commit -m "feat(portfolio): add pure data mapping layer with unit tests"
```

---

## Task 4: Node-network 3D component (isolated)

**Files:**
- Create: `components/portfolio/node-network.tsx`

**Interfaces:**
- Consumes: `three`, `@react-three/fiber`, `@react-three/drei`.
- Produces: `<NodeNetwork nodeCount={number} scene={string} pointer={{x:number,y:number}} accent={string} />` — instanced points + line links; `scene` selects a target formation; lerps toward it each frame; tilts by `pointer`.

- [ ] **Step 1: Implement the component**

Create `components/portfolio/node-network.tsx`:
```tsx
"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const SCENES = ["hero", "tech", "projects", "experience", "contact"] as const
type SceneName = (typeof SCENES)[number]

function formation(scene: string, i: number, n: number): THREE.Vector3 {
  const t = i / n
  const a = t * Math.PI * 2 * 6
  switch (scene) {
    case "tech": { // lattice grid
      const cols = Math.ceil(Math.sqrt(n))
      const x = (i % cols) - cols / 2
      const y = Math.floor(i / cols) - cols / 2
      return new THREE.Vector3(x * 0.6, y * 0.6, 0)
    }
    case "projects": { // clusters
      const cluster = i % 5
      const cx = Math.cos((cluster / 5) * Math.PI * 2) * 3
      const cy = Math.sin((cluster / 5) * Math.PI * 2) * 3
      return new THREE.Vector3(cx + (Math.random() - 0.5), cy + (Math.random() - 0.5), (Math.random() - 0.5))
    }
    case "experience": // vertical chain
      return new THREE.Vector3((Math.random() - 0.5) * 1.5, (t - 0.5) * 10, 0)
    case "contact": { // converge sphere
      const r = 1.2
      const phi = Math.acos(1 - 2 * t)
      return new THREE.Vector3(r * Math.sin(phi) * Math.cos(a), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(a))
    }
    default: { // hero galaxy
      const r = 2 + t * 3
      return new THREE.Vector3(Math.cos(a) * r, (Math.random() - 0.5) * 2, Math.sin(a) * r)
    }
  }
}

export function NodeNetwork({
  nodeCount = 300,
  scene = "hero",
  pointer = { x: 0, y: 0 },
  accent = "#E8785B",
}: {
  nodeCount?: number
  scene?: string
  pointer?: { x: number; y: number }
  accent?: string
}) {
  const group = useRef<THREE.Group>(null)
  const inst = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const current = useMemo(
    () => Array.from({ length: nodeCount }, (_, i) => formation("hero", i, nodeCount)),
    [nodeCount]
  )
  const target = useMemo(
    () => Array.from({ length: nodeCount }, (_, i) => formation(scene, i, nodeCount)),
    [scene, nodeCount]
  )

  useFrame((_, delta) => {
    const mesh = inst.current
    if (!mesh) return
    const lerp = Math.min(1, delta * 2)
    for (let i = 0; i < nodeCount; i++) {
      current[i].lerp(target[i], lerp)
      dummy.position.copy(current[i])
      dummy.scale.setScalar(0.04)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (group.current) {
      group.current.rotation.y += (pointer.x * 0.4 - group.current.rotation.y) * 0.05
      group.current.rotation.x += (pointer.y * 0.3 - group.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={group}>
      <instancedMesh ref={inst} args={[undefined as any, undefined as any, nodeCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/portfolio/node-network.tsx
git commit -m "feat(portfolio): instanced morphing node-network 3D component"
```

---

## Task 5: Scene canvas wrapper (dynamic, gated, mobile-aware)

**Files:**
- Create: `components/portfolio/scene-canvas.tsx`

**Interfaces:**
- Consumes: `NodeNetwork`, `@react-three/fiber`, `@react-three/drei` (`AdaptiveDpr`, `Preload`).
- Produces: `<SceneCanvas scene={string} accent={string} />` — fixed full-screen Canvas, tracks pointer, caps nodes by viewport width. Default-exported for `next/dynamic`.

- [ ] **Step 1: Implement**

Create `components/portfolio/scene-canvas.tsx`:
```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { AdaptiveDpr, Preload } from "@react-three/drei"
import { NodeNetwork } from "./node-network"

export default function SceneCanvas({ scene, accent }: { scene: string; accent: string }) {
  const pointer = useRef({ x: 0, y: 0 })
  const [nodeCount, setNodeCount] = useState(300)

  useEffect(() => {
    setNodeCount(window.innerWidth < 768 ? 80 : 300)
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-0" style={{ background: "radial-gradient(circle at 50% 30%, var(--pf-bg-panel), var(--pf-bg-deep))" }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <NodeNetworkBridge scene={scene} accent={accent} nodeCount={nodeCount} pointerRef={pointer} />
        <AdaptiveDpr pixelated />
        <Preload all />
      </Canvas>
    </div>
  )
}

function NodeNetworkBridge({ scene, accent, nodeCount, pointerRef }: {
  scene: string; accent: string; nodeCount: number; pointerRef: React.MutableRefObject<{ x: number; y: number }>
}) {
  return <NodeNetwork scene={scene} accent={accent} nodeCount={nodeCount} pointer={pointerRef.current} />
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/portfolio/scene-canvas.tsx
git commit -m "feat(portfolio): gated dynamic scene canvas with pointer + node caps"
```

---

## Task 6: GSAP scroll timeline hook

**Files:**
- Create: `components/portfolio/use-scroll-timeline.ts`

**Interfaces:**
- Consumes: `gsap`, `gsap/ScrollTrigger`.
- Produces: `useScrollTimeline(enabled: boolean): { activeScene: string; progress: number }` — registers ScrollTrigger per `[data-scene]` element, updates active scene name + 0..1 progress. When `enabled=false`, uses IntersectionObserver snap fallback (no scrub).

- [ ] **Step 1: Implement**

Create `components/portfolio/use-scroll-timeline.ts`:
```ts
"use client"

import { useEffect, useState } from "react"

export function useScrollTimeline(enabled: boolean) {
  const [activeScene, setActiveScene] = useState("hero")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"))
    if (sections.length === 0) return

    // Fallback path (reduced-motion / 3D off): IntersectionObserver snap.
    if (!enabled) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) setActiveScene(en.target.getAttribute("data-scene") || "hero")
          })
        },
        { threshold: 0.5 }
      )
      sections.forEach((s) => io.observe(s))
      return () => io.disconnect()
    }

    let killed = false
    let cleanup = () => {}
    // Dynamic import so gsap only loads on the scrub path.
    ;(async () => {
      const gsapMod = await import("gsap")
      const stMod = await import("gsap/ScrollTrigger")
      if (killed) return
      const gsap = gsapMod.default
      const ScrollTrigger = stMod.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      const triggers = sections.map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActiveScene(el.getAttribute("data-scene") || "hero")
          },
          onUpdate: (self) => setProgress(self.progress),
        })
      )
      cleanup = () => triggers.forEach((t) => t.kill())
    })()

    return () => {
      killed = true
      cleanup()
    }
  }, [enabled])

  return { activeScene, progress }
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/portfolio/use-scroll-timeline.ts
git commit -m "feat(portfolio): GSAP scroll timeline hook with reduced-motion fallback"
```

---

## Task 7: Section components (Hero, Tech, Projects, Experience, Contact)

**Files:**
- Create: `components/portfolio/sections/hero.tsx`
- Create: `components/portfolio/sections/tech.tsx`
- Create: `components/portfolio/sections/projects.tsx`
- Create: `components/portfolio/sections/experience.tsx`
- Create: `components/portfolio/sections/contact.tsx`

**Interfaces:**
- Consumes: VM types from `lib/portfolio-data.ts`.
- Produces: 5 client components, each a `<section data-scene="..." className="min-h-screen ...">`. Props: `Hero({contact, aboutTraits, funFacts})`, `Tech({tech})`, `Projects({projects})`, `Experience({experiences, education, certifications})`, `Contact({contact})`. Real DOM text, coral CTAs, hover-lift cards, mouse-tilt on hero photo.

- [ ] **Step 1: Hero**

Create `components/portfolio/sections/hero.tsx`:
```tsx
"use client"

import { useRef } from "react"
import Image from "next/image"
import type { ContactVM, AboutTraitVM } from "@/lib/portfolio-data"

export function Hero({ contact, aboutTraits, funFacts }: { contact: ContactVM; aboutTraits: AboutTraitVM[]; funFacts: string[] }) {
  const card = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = card.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`
  }
  const reset = () => { if (card.current) card.current.style.transform = "" }

  return (
    <section data-scene="hero" className="relative z-10 min-h-screen flex items-center px-6 md:px-16">
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto w-full">
        <div>
          {contact.heroBadge && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "color-mix(in srgb, var(--pf-coral) 18%, transparent)", color: "var(--pf-coral-soft)" }}>
              {contact.heroBadge}
            </span>
          )}
          <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight" style={{ color: "var(--pf-cream)" }}>
            {contact.name}
          </h1>
          <p className="mt-3 text-xl md:text-2xl" style={{ color: "var(--pf-coral)" }}>{contact.role}</p>
          <p className="mt-5 max-w-md leading-relaxed" style={{ color: "var(--pf-muted-fg)" }}>{contact.heroDescription}</p>
          <div className="mt-8 flex gap-4">
            <a href="#projects-scene" className="px-6 py-3 rounded-xl font-medium transition hover:scale-105" style={{ background: "var(--pf-coral)", color: "var(--pf-bg-deep)" }}>View Projects</a>
            <a href="#contact-scene" className="px-6 py-3 rounded-xl font-medium border transition hover:scale-105" style={{ borderColor: "var(--pf-teal-glow)", color: "var(--pf-sand)" }}>Get in Touch</a>
          </div>
        </div>
        <div className="flex justify-center">
          <div ref={card} onMouseMove={onMove} onMouseLeave={reset} className="relative rounded-2xl overflow-hidden border transition-transform duration-200 will-change-transform" style={{ borderColor: "color-mix(in srgb, var(--pf-teal-glow) 40%, transparent)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <Image src={contact.photoUrl} alt={contact.name} width={360} height={440} className="object-cover" priority />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Tech**

Create `components/portfolio/sections/tech.tsx`:
```tsx
"use client"

import type { TechCategoryVM } from "@/lib/portfolio-data"

export function Tech({ tech }: { tech: TechCategoryVM[] }) {
  return (
    <section data-scene="tech" id="tech-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12" style={{ color: "var(--pf-cream)" }}>Tech Stack</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tech.map((cat) => (
            <div key={cat.key} className="rounded-2xl p-6 border transition hover:-translate-y-1" style={{ background: "color-mix(in srgb, var(--pf-bg-panel) 70%, transparent)", borderColor: "color-mix(in srgb, var(--pf-teal) 40%, transparent)" }}>
              <h3 className="font-heading text-xl font-semibold mb-1" style={{ color: "var(--pf-sand)" }}>{cat.title}</h3>
              <p className="text-sm mb-4" style={{ color: "var(--pf-muted-fg)" }}>{cat.description}</p>
              <div className="space-y-3">
                {cat.skills.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs mb-1" style={{ color: "var(--pf-cream)" }}>
                      <span>{s.name}</span><span>{s.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "color-mix(in srgb, var(--pf-teal) 25%, transparent)" }}>
                      <div className="h-full rounded-full" style={{ width: `${s.level}%`, background: "var(--pf-coral)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Projects**

Create `components/portfolio/sections/projects.tsx`:
```tsx
"use client"

import Image from "next/image"
import type { ProjectVM } from "@/lib/portfolio-data"

export function Projects({ projects }: { projects: ProjectVM[] }) {
  return (
    <section data-scene="projects" id="projects-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12" style={{ color: "var(--pf-cream)" }}>Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p) => (
            <article key={p.id} className="group rounded-2xl overflow-hidden border transition hover:-translate-y-1.5" style={{ background: "color-mix(in srgb, var(--pf-bg-panel) 75%, transparent)", borderColor: "color-mix(in srgb, var(--pf-teal) 35%, transparent)" }}>
              {p.images[0] && (
                <div className="relative h-48 overflow-hidden">
                  <Image src={p.images[0]} alt={p.title} fill className="object-cover transition group-hover:scale-105" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold mb-2" style={{ color: "var(--pf-sand)" }}>{p.title}</h3>
                <p className="text-sm mb-4" style={{ color: "var(--pf-muted-fg)" }}>{p.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.slice(0, 5).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--pf-teal-glow) 20%, transparent)", color: "var(--pf-teal-glow)" }}>{t}</span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm">
                  {p.demoLink !== "#" && <a href={p.demoLink} target="_blank" rel="noreferrer" style={{ color: "var(--pf-coral)" }}>Demo →</a>}
                  {p.githubLink !== "#" && <a href={p.githubLink} target="_blank" rel="noreferrer" style={{ color: "var(--pf-sand)" }}>Code →</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Experience (with Education + Certs folded in)**

Create `components/portfolio/sections/experience.tsx`:
```tsx
"use client"

import type { ExperienceVM, EducationVM, CertVM } from "@/lib/portfolio-data"

export function Experience({ experiences, education, certifications }: { experiences: ExperienceVM[]; education: EducationVM[]; certifications: CertVM[] }) {
  return (
    <section data-scene="experience" id="experience-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12" style={{ color: "var(--pf-cream)" }}>Experience</h2>
        <div className="relative border-l-2 pl-8 space-y-10" style={{ borderColor: "color-mix(in srgb, var(--pf-teal-glow) 45%, transparent)" }}>
          {experiences.map((e, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full" style={{ background: "var(--pf-coral)" }} />
              <h3 className="font-heading text-xl font-semibold" style={{ color: "var(--pf-sand)" }}>{e.position}</h3>
              <p className="text-sm" style={{ color: "var(--pf-teal-glow)" }}>{e.company} · {e.duration}</p>
              <ul className="mt-2 space-y-1 text-sm list-disc list-inside" style={{ color: "var(--pf-muted-fg)" }}>
                {e.description.slice(0, 3).map((d, j) => <li key={j}>{d}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "var(--pf-cream)" }}>Education</h3>
            {education.map((ed, i) => (
              <div key={i} className="mb-4 rounded-xl p-4 border" style={{ borderColor: "color-mix(in srgb, var(--pf-teal) 35%, transparent)" }}>
                <p className="font-semibold" style={{ color: "var(--pf-sand)" }}>{ed.degree}</p>
                <p className="text-sm" style={{ color: "var(--pf-muted-fg)" }}>{ed.institution} · {ed.duration}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "var(--pf-cream)" }}>Certifications</h3>
            {certifications.map((c, i) => (
              <div key={i} className="mb-4 rounded-xl p-4 border" style={{ borderColor: "color-mix(in srgb, var(--pf-teal) 35%, transparent)" }}>
                <p className="font-semibold" style={{ color: "var(--pf-sand)" }}>{c.name}</p>
                <p className="text-sm" style={{ color: "var(--pf-muted-fg)" }}>{c.issuer} · {c.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Contact**

Create `components/portfolio/sections/contact.tsx`:
```tsx
"use client"

import type { ContactVM } from "@/lib/portfolio-data"

export function Contact({ contact }: { contact: ContactVM }) {
  const links = [
    ["GitHub", contact.githubUrl], ["LinkedIn", contact.linkedinUrl],
    ["Instagram", contact.instagramUrl], ["GitLab", contact.gitlabUrl], ["Twitter", contact.twitterUrl],
  ].filter(([, u]) => !!u) as [string, string][]

  return (
    <section data-scene="contact" id="contact-scene" className="relative z-10 min-h-screen flex items-center px-6 md:px-16">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6" style={{ color: "var(--pf-cream)" }}>Let&apos;s build something</h2>
        <p className="mb-8" style={{ color: "var(--pf-muted-fg)" }}>{contact.location}</p>
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="inline-block px-8 py-4 rounded-xl font-medium transition hover:scale-105 mb-8" style={{ background: "var(--pf-coral)", color: "var(--pf-bg-deep)" }}>
            {contact.email}
          </a>
        )}
        <div className="flex justify-center gap-6 flex-wrap">
          {links.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" className="text-sm transition hover:opacity-70" style={{ color: "var(--pf-sand)" }}>{label}</a>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/portfolio/sections
git commit -m "feat(portfolio): 5 scroll section components (hero,tech,projects,experience,contact)"
```

---

## Task 8: HUD + orchestrator + wire into page

**Files:**
- Create: `components/portfolio/hud.tsx`
- Create: `components/portfolio/portfolio-3d.tsx`
- Modify: `app/page.tsx` (empty → server component)

**Interfaces:**
- Consumes: all section components, `SceneCanvas` (via dynamic), `useScrollTimeline`, `mapPortfolioData`, `getAppearance`.
- Produces:
  - `<Hud active={string} scenes={string[]} />` — fixed z20 progress dots + labels.
  - `<Portfolio3D data={PortfolioData} appearance={{...}} />` — sets `--pf-coral` from `accentColor`, computes 3D-enabled gate, renders canvas (or gradient) + sections + HUD.
  - `app/page.tsx` server component fetching Prisma + Appearance.

- [ ] **Step 1: HUD**

Create `components/portfolio/hud.tsx`:
```tsx
"use client"

export function Hud({ active, scenes }: { active: string; scenes: string[] }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-4">
      {scenes.map((s) => (
        <a key={s} href={`#${s}-scene`} className="group flex items-center gap-2 justify-end">
          <span className="text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition" style={{ color: "var(--pf-sand)" }}>{s}</span>
          <span className="w-2.5 h-2.5 rounded-full transition" style={{ background: active === s ? "var(--pf-coral)" : "color-mix(in srgb, var(--pf-muted-fg) 50%, transparent)", transform: active === s ? "scale(1.4)" : "scale(1)" }} />
        </a>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Orchestrator**

Create `components/portfolio/portfolio-3d.tsx`:
```tsx
"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import type { PortfolioData } from "@/lib/portfolio-data"
import { Hero } from "./sections/hero"
import { Tech } from "./sections/tech"
import { Projects } from "./sections/projects"
import { Experience } from "./sections/experience"
import { Contact } from "./sections/contact"
import { Hud } from "./hud"
import { useScrollTimeline } from "./use-scroll-timeline"

const SceneCanvas = dynamic(() => import("./scene-canvas"), { ssr: false })

type AppearanceVM = { motionLevel: string; enable3D: boolean; accentColor: string }
const SCENES = ["hero", "tech", "projects", "experience", "contact"]

export function Portfolio3D({ data, appearance }: { data: PortfolioData; appearance: AppearanceVM }) {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(m.matches)
    const fn = () => setReduced(m.matches)
    m.addEventListener("change", fn)
    document.documentElement.style.setProperty("--pf-coral", appearance.accentColor)
    return () => m.removeEventListener("change", fn)
  }, [appearance.accentColor])

  const use3D = appearance.enable3D && appearance.motionLevel !== "off" && !reduced
  const { activeScene } = useScrollTimeline(use3D)

  return (
    <main className="relative w-full" style={{ background: "var(--pf-bg-deep)" }}>
      {use3D ? (
        <SceneCanvas scene={activeScene} accent={appearance.accentColor} />
      ) : (
        <div className="fixed inset-0 -z-0" style={{ background: "radial-gradient(circle at 50% 30%, var(--pf-bg-panel), var(--pf-bg-deep))" }} />
      )}
      <Hero contact={data.contact} aboutTraits={data.aboutTraits} funFacts={data.funFacts} />
      <Tech tech={data.tech} />
      <Projects projects={data.projects} />
      <Experience experiences={data.experiences} education={data.education} certifications={data.certifications} />
      <Contact contact={data.contact} />
      <Hud active={activeScene} scenes={SCENES} />
    </main>
  )
}
```

- [ ] **Step 3: Wire page.tsx**

Overwrite `app/page.tsx`:
```tsx
import { prisma } from "@/lib/prisma"
import { mapPortfolioData } from "@/lib/portfolio-data"
import { getAppearance } from "@/app/admin/actions/appearance"
import { Portfolio3D } from "@/components/portfolio/portfolio-3d"

export default async function Home() {
  const [profile, projects, experiences, education, certifications, techCategories, aboutTraits, funFacts, appearance] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { id: 1 } }),
    prisma.project.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.workExperience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.certification.findMany({ orderBy: { order: "asc" } }),
    prisma.techCategory.findMany({ orderBy: { order: "asc" }, include: { skills: { orderBy: { order: "asc" } } } }),
    prisma.aboutTrait.findMany({ orderBy: { order: "asc" } }),
    prisma.funFact.findMany({ orderBy: { order: "asc" } }),
    getAppearance(),
  ])

  const data = mapPortfolioData({ profile, projects, experiences, education, certifications, techCategories, aboutTraits, funFacts })

  return <Portfolio3D data={data} appearance={{ motionLevel: appearance.motionLevel, enable3D: appearance.enable3D, accentColor: appearance.accentColor }} />
}
```

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: PASS. (If DB unreachable, run `pnpm exec tsc --noEmit` + `pnpm exec next lint` instead; both PASS.)

- [ ] **Step 5: Manual smoke**

Run: `pnpm dev`, open `http://localhost:3000`.
Verify: 5 sections scroll; 3D backdrop renders; HUD dots highlight active section; hero photo tilts on mouse; mobile (~375px) shows fewer nodes; DevTools → emulate `prefers-reduced-motion` → static gradient, content still scrolls.

- [ ] **Step 6: Commit**

```bash
git add components/portfolio/hud.tsx components/portfolio/portfolio-3d.tsx app/page.tsx
git commit -m "feat(portfolio): HUD, orchestrator, wire 3D portfolio into home page"
```

---

## Task 9: Admin Appearance panel

**Files:**
- Create: `app/admin/(dashboard)/appearance/page.tsx`
- Create: `app/admin/(dashboard)/appearance/appearance-client.tsx`
- Modify: `components/admin/sidebar.tsx` (add nav item + icon)

**Interfaces:**
- Consumes: `getAppearance`, `updateAppearance` from `app/admin/actions/appearance.ts`.
- Produces: admin route `/admin/appearance` with a form controlling palette (select), motionLevel (select full|reduced|off), enable3D (switch), accentColor (color input), headingFont (text). Sidebar link labeled "Appearance".

- [ ] **Step 1: Server page**

Create `app/admin/(dashboard)/appearance/page.tsx`:
```tsx
import { getAppearance } from "@/app/admin/actions/appearance"
import AppearanceClient from "./appearance-client"

export default async function AppearanceAdminPage() {
  const appearance = await getAppearance()
  return <AppearanceClient initialData={appearance} />
}
```

- [ ] **Step 2: Client form**

Create `app/admin/(dashboard)/appearance/appearance-client.tsx`:
```tsx
"use client"

import { updateAppearance } from "@/app/admin/actions/appearance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type Appearance = { palette: string; motionLevel: string; enable3D: boolean; accentColor: string; headingFont: string }

export default function AppearanceClient({ initialData }: { initialData: Appearance }) {
  async function action(formData: FormData) {
    await updateAppearance(formData)
    toast.success("Appearance updated")
  }
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Appearance</h1>
      <form action={action} className="space-y-6">
        <div>
          <Label htmlFor="palette">Palette</Label>
          <select id="palette" name="palette" defaultValue={initialData.palette} className="w-full mt-1 rounded-lg border bg-background p-2">
            <option value="teal-coral">Teal + Coral</option>
          </select>
        </div>
        <div>
          <Label htmlFor="motionLevel">Motion Level</Label>
          <select id="motionLevel" name="motionLevel" defaultValue={initialData.motionLevel} className="w-full mt-1 rounded-lg border bg-background p-2">
            <option value="full">Full</option>
            <option value="reduced">Reduced</option>
            <option value="off">Off</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="enable3D" name="enable3D" defaultChecked={initialData.enable3D} />
          <Label htmlFor="enable3D">Enable 3D background</Label>
        </div>
        <div>
          <Label htmlFor="accentColor">Accent Color</Label>
          <Input id="accentColor" name="accentColor" type="color" defaultValue={initialData.accentColor} className="h-12 w-24" />
        </div>
        <div>
          <Label htmlFor="headingFont">Heading Font</Label>
          <Input id="headingFont" name="headingFont" defaultValue={initialData.headingFont} />
        </div>
        <Button type="submit">Save</Button>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Add sidebar nav item**

In `components/admin/sidebar.tsx`:
- Add `Palette` to the lucide-react import list (line 10-26 block).
- Add to `NAV_ITEMS` after the About entry:
```tsx
  { href: "/admin/appearance", label: "Appearance", icon: Palette },
```

- [ ] **Step 4: Build + manual**

Run: `pnpm build` (or `pnpm exec tsc --noEmit` if no DB).
Then `pnpm dev` → `/admin/appearance`: change accent color → Save → toast → reload home page → coral accents reflect new color. Toggle Enable 3D off → home renders static gradient.

- [ ] **Step 5: Commit**

```bash
git add "app/admin/(dashboard)/appearance" components/admin/sidebar.tsx
git commit -m "feat(admin): Appearance panel controlling palette, motion, 3D, accent"
```

---

## Task 10: Final QA + metadata

**Files:**
- Modify: `app/layout.tsx` (verify metadata still valid; no code change unless broken)

**Interfaces:** none new.

- [ ] **Step 1: Full build**

Run: `pnpm build`
Expected: PASS, no type errors, no missing-module errors.

- [ ] **Step 2: Run unit tests**

Run: `pnpm exec vitest run`
Expected: PASS (portfolio-data test green).

- [ ] **Step 3: Lint**

Run: `pnpm exec next lint`
Expected: no new errors in `components/portfolio/**` or `app/page.tsx`.

- [ ] **Step 4: Manual QA checklist**

`pnpm dev`, verify:
- Desktop: 5 scenes scroll smoothly, network morphs per scene, HUD active dot tracks, hero tilt works, project cards hover-lift, links open.
- Mobile (375px): fewer nodes, layout stacks, no horizontal scroll.
- `prefers-reduced-motion`: static gradient, snap section tracking.
- Admin 3D-off toggle: static gradient on home.
- Text contrast readable throughout.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore(portfolio): final QA pass for 3D redesign"
```

---

## Self-Review Notes

- **Spec coverage:** deps+tokens (T1), Appearance model/action (T2), data map (T3), node-network (T4), gated canvas (T5), GSAP scroll (T6), 5 sections (T7), HUD+orchestrator+page (T8), admin panel (T9), QA (T10). All spec sections mapped.
- **Gates:** reduced-motion + enable3D + motionLevel=off all checked in `portfolio-3d.tsx` `use3D`. ✓
- **Type consistency:** VM types defined in T3 consumed unchanged in T7/T8. `getAppearance`/`updateAppearance` defined T2, consumed T8/T9. `SceneCanvas` default export (T5) matches dynamic import (T8). ✓
- **Known risk:** if repo build requires live MySQL, DB-dependent build steps fall back to `tsc --noEmit` + `next lint` (noted inline per task).
