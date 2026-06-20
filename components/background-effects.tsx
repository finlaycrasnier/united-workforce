"use client"

import { useEffect, useRef } from "react"

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Create particles
    const particles = Array.from({ length: 22 }, () => ({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * 200,
      size: 4 + Math.random() * 10,
      speed: 0.4 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.3,
      opacity: 0,
      maxOpacity: 0.3 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.y -= p.speed
        p.x += p.drift
        p.phase += 0.02

        // Fade in near bottom, fade out near top
        const progress = 1 - p.y / canvas.height
        if (progress < 0.1) p.opacity = p.maxOpacity * (progress / 0.1)
        else if (progress > 0.85) p.opacity = p.maxOpacity * ((1 - progress) / 0.15)
        else p.opacity = p.maxOpacity

        // Reset when off screen
        if (p.y < -20) {
          p.y = canvas.height + 20
          p.x = Math.random() * canvas.width
          p.opacity = 0
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2)
        // Warm peach/coral colour
        ctx.fillStyle = `oklch(0.73 0.15 42)`
        ctx.fill()
        ctx.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="united-animated-bg absolute inset-0" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: "normal" }}
      />
    </div>
  )
}
