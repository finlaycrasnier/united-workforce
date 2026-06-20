"use client"

import { useEffect, useRef } from "react"

/**
 * A soft peach glow that smoothly trails the mouse cursor.
 * Uses a single rAF loop with linear interpolation for a gentle lag.
 * Disabled for touch devices and when reduced motion is preferred.
 */
export function CursorTrail() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isTouch = window.matchMedia("(pointer: coarse)").matches
    if (reduceMotion || isTouch) return

    // Start off-screen until the first move.
    let targetX = -200
    let targetY = -200
    let x = targetX
    let y = targetY
    let raf = 0
    let visible = false

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!visible) {
        visible = true
        el.style.opacity = "1"
      }
    }

    const onLeave = () => {
      visible = false
      el.style.opacity = "0"
    }

    const tick = () => {
      // Ease toward the cursor for a soft trailing feel.
      x += (targetX - x) * 0.14
      y += (targetY - y) * 0.14
      el.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 size-80 rounded-full opacity-0 blur-3xl transition-opacity duration-500 will-change-transform"
      style={{
        background:
          "radial-gradient(circle, oklch(0.82 0.13 50 / 0.35) 0%, oklch(0.85 0.1 40 / 0.12) 40%, transparent 70%)",
      }}
    />
  )
}
