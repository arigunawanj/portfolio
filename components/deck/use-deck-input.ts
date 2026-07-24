"use client"

import { useEffect, useRef } from "react"
import { useDeck } from "./deck-provider"

const WHEEL_THRESHOLD = 40
const COOLDOWN_MS = 700

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable
}

export function useDeckInput() {
  const { go, goTo, mode, isTransitioning, total } = useDeck()
  const lockedRef = useRef(false)
  const accumRef = useRef(0)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (mode !== "deck") return

    const unlockSoon = () => {
      window.setTimeout(() => {
        lockedRef.current = false
        accumRef.current = 0
      }, COOLDOWN_MS)
    }

    const trigger = (dir: 1 | -1) => {
      if (lockedRef.current || isTransitioning) return
      lockedRef.current = true
      go(dir)
      unlockSoon()
    }

    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault()
          trigger(1)
          break
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault()
          trigger(-1)
          break
        case "Home":
          e.preventDefault()
          goTo(0)
          break
        case "End":
          e.preventDefault()
          goTo(total - 1)
          break
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (lockedRef.current || isTransitioning) return
      accumRef.current += e.deltaY
      if (Math.abs(accumRef.current) < WHEEL_THRESHOLD) return
      trigger(accumRef.current > 0 ? 1 : -1)
    }

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      touchStartRef.current = { x: t.clientX, y: t.clientY }
    }

    const onTouchEnd = (e: TouchEvent) => {
      const start = touchStartRef.current
      if (!start) return
      const t = e.changedTouches[0]
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      touchStartRef.current = null
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return
      if (Math.abs(dy) >= Math.abs(dx)) trigger(dy < 0 ? 1 : -1)
      else trigger(dx < 0 ? 1 : -1)
    }

    window.addEventListener("keydown", onKey)
    window.addEventListener("wheel", onWheel, { passive: true })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [go, goTo, mode, isTransitioning, total])
}
