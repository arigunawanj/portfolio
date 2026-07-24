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
