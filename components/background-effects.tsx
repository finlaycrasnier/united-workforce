"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  startBottom: number
}

export function BackgroundEffects() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 6,          // smaller: 4–10px
        duration: 12 + Math.random() * 22,    // varied speed: 12–34s
        delay: Math.random() * 8,             // positive only
        drift: (Math.random() - 0.5) * 120,
        startBottom: -(Math.random() * 10),   // all spawn from bottom (negative = below viewport)
      }))
    )
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="united-animated-bg absolute inset-0" />
      <style>{`
        @keyframes rise {
          from {
            transform: translateY(0) translateX(0px);
            opacity: 0;
          }
          5% { opacity: 0.5; }
          95% { opacity: 0.5; }
          to {
            transform: translateY(-105vh) translateX(var(--drift, 0px));
            opacity: 0;
          }
        }
      `}</style>
      {particles.map((p) => (
        <span
          key={p.id}
          style={
            {
              position: "fixed",
              left: `${p.left}%`,
              bottom: `${p.startBottom}vh`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "9999px",
              background: "rgba(255, 150, 110, 0.5)",
              filter: "blur(0.5px)",
              animationName: "rise",
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationFillMode: "both",
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
