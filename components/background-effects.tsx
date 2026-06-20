"use client"

import { useEffect, useState } from "react"

interface Particle {
  left: string
  size: number
  delay: number
  duration: number
  drift: number
  opacity: number
}

export function BackgroundEffects() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, () => ({
        left: Math.random() * 100,
        size: 3 + Math.random() * 7,
        delay: Math.random() * -24,
        duration: 22 + Math.random() * 20,
        drift: (Math.random() - 0.5) * 120,
        opacity: 0.15 + Math.random() * 0.35,
      })).map(p => ({
        left: `${p.left}%`,
        size: p.size,
        delay: p.delay,
        duration: p.duration,
        drift: p.drift,
        opacity: p.opacity,
      }))
    )
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="united-animated-bg absolute inset-0" />
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary"
          style={{
            left: p.left,
            bottom: "-10vh",
            width: p.size,
            height: p.size,
            opacity: 0,
            animation: `particle-rise-${i % 6} ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes particle-rise-0 { 0%{opacity:0;transform:translateY(0) translateX(0)} 10%{opacity:0.4} 90%{opacity:0.4} 100%{opacity:0;transform:translateY(-120vh) translateX(30px)} }
        @keyframes particle-rise-1 { 0%{opacity:0;transform:translateY(0) translateX(0)} 10%{opacity:0.3} 90%{opacity:0.3} 100%{opacity:0;transform:translateY(-120vh) translateX(-40px)} }
        @keyframes particle-rise-2 { 0%{opacity:0;transform:translateY(0) translateX(0)} 10%{opacity:0.5} 90%{opacity:0.5} 100%{opacity:0;transform:translateY(-120vh) translateX(20px)} }
        @keyframes particle-rise-3 { 0%{opacity:0;transform:translateY(0) translateX(0)} 10%{opacity:0.35} 90%{opacity:0.35} 100%{opacity:0;transform:translateY(-120vh) translateX(-25px)} }
        @keyframes particle-rise-4 { 0%{opacity:0;transform:translateY(0) translateX(0)} 10%{opacity:0.45} 90%{opacity:0.45} 100%{opacity:0;transform:translateY(-120vh) translateX(50px)} }
        @keyframes particle-rise-5 { 0%{opacity:0;transform:translateY(0) translateX(0)} 10%{opacity:0.25} 90%{opacity:0.25} 100%{opacity:0;transform:translateY(-120vh) translateX(-15px)} }
      `}</style>
    </div>
  )
}
