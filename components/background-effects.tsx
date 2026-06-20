"use client"

import { useEffect, useState } from "react"

interface Particle {
  left: string
  size: number
  delay: string
  duration: string
  drift: string
  opacity: number
  hue: number
}

export function BackgroundEffects() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 28 }, () => {
        const size = 8 + Math.random() * 18
        return {
          left: `${Math.random() * 100}%`,
          size,
          delay: `${Math.random() * -30}s`,
          duration: `${18 + Math.random() * 16}s`,
          drift: `${(Math.random() - 0.5) * 100}px`,
          opacity: 0.55 + Math.random() * 0.35,
          hue: 28 + Math.random() * 24,
        }
      }),
    )
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="united-animated-bg absolute inset-0" />
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[-10vh] rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: `oklch(0.72 0.16 ${p.hue})`,
            opacity: p.opacity,
            animation: `united-float ${p.duration} linear ${p.delay} infinite`,
            ["--particle-drift" as string]: p.drift,
            ["--particle-opacity" as string]: p.opacity,
          }}
        />
      ))}
    </div>
  )
}
