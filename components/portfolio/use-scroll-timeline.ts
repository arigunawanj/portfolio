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
