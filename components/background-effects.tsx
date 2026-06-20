"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  opacity: number
}

export function BackgroundEffects() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 18,
        duration: 18 + Math.random() * 15,
        delay: -(Math.random() * 25),
        drift: (Math.random() - 0.5) * 120,
        opacity: 0.18 + Math.random() * 0.25,
      }))
    )
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 united-animated-bg"
      />
      <style>{`
        @keyframes particleFloat {
          0% { transform: translate3d(0,0,0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate3d(var(--x), -120vh, 0); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <span
          key={p.id}
          style={
            {
              position: "absolute",
              left: `${p.left}%`,
              bottom: "-40px",
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "9999px",
              background: "rgba(255, 160, 122, 0.55)",
              filter: "blur(1px)",
              opacity: p.opacity,
              animation: `particleFloat ${p.duration}s linear ${p.delay}s infinite`,
              willChange: "transform, opacity",
              "--x": `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
