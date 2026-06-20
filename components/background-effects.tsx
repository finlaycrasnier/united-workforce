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

/**
 * Fixed, full-screen ambient background:
 *  - a very slow peach-to-cream animated gradient
 *  - a field of faint, slowly rising particles
 * Sits behind all content (z-0) and ignores pointer events.
 */
export function BackgroundEffects() {
  // Generate the random particle field only on the client after mount to
  // avoid an SSR/client hydration mismatch from Math.random().
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, () => {
        const size = 3 + Math.random() * 7
        return {
          left: `${Math.random() * 100}%`,
          size,
          delay: `${Math.random() * -24}s`,
          duration: `${22 + Math.random() * 20}s`,
          drift: `${(Math.random() - 0.5) * 120}px`,
          opacity: 0.15 + Math.random() * 0.35,
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
          className="absolute bottom-[-10vh] rounded-full bg-primary"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `united-float ${p.duration} linear ${p.delay} infinite`,
            // custom props consumed by the keyframes in globals.css
            ["--particle-drift" as string]: p.drift,
            ["--particle-opacity" as string]: p.opacity,
          }}
        />
      ))}
    </div>
  )
}
