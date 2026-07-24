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
            className="group flex items-center gap-2.5 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1020]"
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
