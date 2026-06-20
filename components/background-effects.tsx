"use client"

import { useEffect, useState } from "react"

interface Particle {
  left: string
  size: number
  delay: string
  duration: string
  drift: string
}

export function BackgroundEffects() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        size: 6 + Math.random() * 10,
        delay: `${-(Math.random() * 25)}s`,
        duration: `${20 + Math.random() * 18}s`,
        drift: `${(Math.random() - 0.5) * 80}px`,
      }))
    )
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="united-animated-bg absolute inset-0" />
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          8%   { opacity: 0.45; }
          92%  { opacity: 0.45; }
          100% { transform: translateY(-115vh) translateX(var(--drift)); opacity: 0; }
        }
      `}</style>
      {particles.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            bottom: "-5vh",
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "9999px",
            backgroundColor: "oklch(0.72 0.15 40)",
            ["--drift" as string]: p.drift,
            animationName: "floatUp",
            animationDuration: p.duration,
            animationDelay: p.delay,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationFillMode: "both",
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
