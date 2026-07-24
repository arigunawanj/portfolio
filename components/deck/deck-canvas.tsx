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
