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
