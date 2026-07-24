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

      // Section triggers for snaps/lerps states
      const triggers = sections.map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveScene(el.getAttribute("data-scene") || "hero")
            }
          },
          onUpdate: (self) => setProgress(self.progress),
        })
      )

      // Continuous global page scroll trigger driving Three.js camera/group coords
      const mainTrigger = ScrollTrigger.create({
        trigger: "#main",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          if (typeof window !== "undefined") {
            ;(window as any).scrollProgress = self.progress
          }
        }
      })

      // DOM Parallax for section headers
      const parallaxAnimations: any[] = []
      const headers = gsap.utils.toArray<HTMLElement>(".pf-parallax-header")
      headers.forEach((header) => {
        const anim = gsap.fromTo(header, 
          { y: 25 },
          {
            y: -25,
            ease: "none",
            scrollTrigger: {
              trigger: header,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        )
        parallaxAnimations.push(anim)
      })

      cleanup = () => {
        triggers.forEach((t) => t.kill())
        mainTrigger.kill()
        parallaxAnimations.forEach((a) => {
          if (a.scrollTrigger) a.scrollTrigger.kill()
          a.kill()
        })
      }
    })()

    return () => {
      killed = true
      cleanup()
    }
  }, [enabled])

  return { activeScene, progress }
}
