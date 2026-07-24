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
    <main id="main" className="relative w-full" style={{ background: "var(--pf-bg-deep)" }}>
      <a href="#hero-scene" className="pf-skip-link">Skip to content</a>
      {use3D ? (
        <SceneCanvas scene={activeScene} accent={appearance.accentColor} />
      ) : (
        <div className="fixed inset-0 -z-0" style={{ background: "radial-gradient(circle at 50% 30%, var(--pf-bg-panel), var(--pf-bg-deep))" }} />
      )}
      <div className="pf-grid-overlay" aria-hidden />
      {/* top status bar */}
      <div className="fixed top-0 inset-x-0 z-20 hidden md:flex items-center justify-between px-6 py-3 font-mono-pf text-[10px] tracking-wider" style={{ color: "var(--pf-muted-fg)" }}>
        <span style={{ color: "var(--pf-teal-glow)" }}>◆ portfolio.sol</span>
        <span>{"{ "}<span style={{ color: "var(--pf-coral)" }}>ari</span>.jatmiko{" }"}</span>
        <span className="flex items-center gap-2"><span className="pf-status-dot" /> connected</span>
      </div>
      <Hero contact={data.contact} aboutTraits={data.aboutTraits} funFacts={data.funFacts} />
      <Tech tech={data.tech} />
      <Projects projects={data.projects} />
      <Experience experiences={data.experiences} education={data.education} certifications={data.certifications} />
      <Contact contact={data.contact} />
      <Hud active={activeScene} scenes={SCENES} />
    </main>
  )
}
