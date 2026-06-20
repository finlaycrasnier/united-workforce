"use client"

import { useEffect, useState } from "react"

interface Particle {
  left: string
  size: number
  delay: string
  duration: string
  drift: string
  opacity: number
}

export function BackgroundEffects() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 22 }, () => {
        const size = 4 + Math.random() * 8
        return {
          left: `${Math.random() * 100}%`,
          size,
          delay: `${Math.random() * -24}s`,
          duration: `${22 + Math.random() * 20}s`,
          drift: `${(Math.random() - 0.5) * 120}px`,
          opacity: 0.4 + Math.random() * 0.4,
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
            backgroundColor: `oklch(0.68 0.14 ${40 + Math.random() * 20})`,
            animation: `united-float ${p.duration} linear ${p.delay} infinite`,
            ["--particle-drift" as string]: p.drift,
            ["--particle-opacity" as string]: p.opacity,
          }}
        />
      ))}
    </div>
  )
}
