"use client"

import { useEffect, useState } from "react"

interface Particle {
  left: string
  size: number
  delay: string
  duration: string
  animIndex: number
}

export function BackgroundEffects() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        size: 6 + Math.random() * 10,
        delay: `${-(Math.random() * 28)}s`,
        duration: `${20 + Math.random() * 18}s`,
        animIndex: i % 4,
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
        @keyframes rise0 {
          0%   { transform: translateY(0)      translateX(0);    opacity: 0; }
          8%   { opacity: 0.5; }
          92%  { opacity: 0.5; }
          100% { transform: translateY(-110vh) translateX(35px); opacity: 0; }
        }
        @keyframes rise1 {
          0%   { transform: translateY(0)      translateX(0);     opacity: 0; }
          8%   { opacity: 0.4; }
          92%  { opacity: 0.4; }
          100% { transform: translateY(-110vh) translateX(-45px); opacity: 0; }
        }
        @keyframes rise2 {
          0%   { transform: translateY(0)      translateX(0);    opacity: 0; }
          8%   { opacity: 0.6; }
          92%  { opacity: 0.6; }
          100% { transform: translateY(-110vh) translateX(20px); opacity: 0; }
        }
        @keyframes rise3 {
          0%   { transform: translateY(0)      translateX(0);     opacity: 0; }
          8%   { opacity: 0.35; }
          92%  { opacity: 0.35; }
          100% { transform: translateY(-110vh) translateX(-30px); opacity: 0; }
        }
      `}</style>

      {particles.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: p.left,
            bottom: 0,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "9999px",
            backgroundColor: "oklch(0.75 0.14 42)",
            animationName: `rise${p.animIndex}`,
            animationDuration: p.duration,
            animationDelay: p.delay,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationFillMode: "both",
          }}
        />
      ))}
    </div>
  )
}
