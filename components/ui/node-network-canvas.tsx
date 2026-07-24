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
