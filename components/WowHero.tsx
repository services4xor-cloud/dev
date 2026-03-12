'use client'

import { useEffect, useState } from 'react'
import { detectCountryFromTimezone } from '@/lib/geo'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'

interface WowHeroProps {
  onBegin: () => void
  returning?: boolean
}

// Global city positions arranged in a circle around center
const CITY_NODES = [
  { label: 'Nairobi', angle: 0 },
  { label: 'Berlin', angle: 45 },
  { label: 'London', angle: 90 },
  { label: 'Dubai', angle: 135 },
  { label: 'Lagos', angle: 180 },
  { label: 'Toronto', angle: 225 },
  { label: 'Mumbai', angle: 270 },
  { label: 'Zurich', angle: 315 },
]

export default function WowHero({ onBegin, returning }: WowHeroProps) {
  const [detectedName, setDetectedName] = useState('')
  const [visible, setVisible] = useState(false)
  const [textStage, setTextStage] = useState(0) // 0=nothing, 1=first text, 2=second, 3=CTA

  useEffect(() => {
    const code = detectCountryFromTimezone()
    const option = COUNTRY_OPTIONS.find((c) => c.code === code)
    if (option) setDetectedName(option.name)
    else setDetectedName('here')

    // Stagger text reveals
    const t0 = setTimeout(() => setVisible(true), 100)
    const t1 = setTimeout(() => setTextStage(1), 300)
    const t2 = setTimeout(() => setTextStage(2), 1300)
    const t3 = setTimeout(() => setTextStage(3), 2300)
    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  const ctaText = returning ? 'Enter My World \u2192' : 'Tell us who you are'

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-brand-bg overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgb(var(--color-accent-rgb) / 0.08) 0%, rgb(var(--color-primary-rgb) / 0.04) 40%, transparent 70%)',
        }}
      />

      {/* SVG Network Animation */}
      <div
        className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] mb-10 transition-opacity duration-1000"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden="true">
          {/* Pulsing lines from center to outer nodes */}
          {CITY_NODES.map((node, i) => {
            const rad = (node.angle * Math.PI) / 180
            const radius = 155
            const x = 200 + radius * Math.cos(rad)
            const y = 200 + radius * Math.sin(rad)
            return (
              <line
                key={node.label}
                x1="200"
                y1="200"
                x2={x}
                y2={y}
                stroke="var(--color-accent)"
                strokeWidth="1"
                strokeOpacity="0.3"
                style={{
                  animation: `pulse-line 2.5s ease-in-out ${i * 0.3}s infinite`,
                }}
              />
            )
          })}

          {/* Outer dots (cities) */}
          {CITY_NODES.map((node) => {
            const rad = (node.angle * Math.PI) / 180
            const radius = 155
            const x = 200 + radius * Math.cos(rad)
            const y = 200 + radius * Math.sin(rad)
            return (
              <g key={node.label}>
                <circle cx={x} cy={y} r="5" fill="var(--color-accent)" opacity="0.5" />
                <text
                  x={x}
                  y={y + 18}
                  textAnchor="middle"
                  fill="white"
                  opacity="0.4"
                  fontSize="10"
                  fontFamily="sans-serif"
                >
                  {node.label}
                </text>
              </g>
            )
          })}

          {/* Center dot — user location */}
          <circle cx="200" cy="200" r="10" fill="var(--color-accent)" opacity="0.9">
            <animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle
            cx="200"
            cy="200"
            r="20"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1"
            opacity="0.3"
          >
            <animate attributeName="r" values="15;25;15" dur="3s" repeatCount="indefinite" />
            <animate
              attributeName="opacity"
              values="0.3;0.1;0.3"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Country label near center dot */}
          {detectedName && (
            <text
              x="200"
              y="235"
              textAnchor="middle"
              fill="var(--color-accent)"
              fontSize="12"
              fontFamily="sans-serif"
              fontWeight="600"
            >
              {detectedName}
            </text>
          )}
        </svg>
      </div>

      {/* Text reveals */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <h1
          className="text-phi-3xl md:text-phi-4xl font-bold text-white mb-4 transition-all duration-700"
          style={{
            opacity: textStage >= 1 ? 1 : 0,
            transform: textStage >= 1 ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          You are here.
        </h1>

        <p
          className="text-phi-xl text-white/70 mb-10 transition-all duration-700"
          style={{
            opacity: textStage >= 2 ? 1 : 0,
            transform: textStage >= 2 ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          The world is connected to you.
        </p>

        <div
          className="transition-all duration-700"
          style={{
            opacity: textStage >= 3 ? 1 : 0,
            transform: textStage >= 3 ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <button
            onClick={onBegin}
            className="bg-brand-primary text-white px-8 py-4 rounded-full text-phi-lg font-bold
                       hover:bg-brand-primary/90 transition-all duration-200
                       hover:scale-[1.02] active:scale-[0.98]
                       border border-[rgb(var(--color-accent-rgb)/0.4)]
                       shadow-[0_8px_32px_rgb(var(--color-primary-rgb)/0.40)]"
          >
            {ctaText}
          </button>
        </div>
      </div>

      {/* CSS keyframes for line pulse */}
      <style jsx>{`
        @keyframes pulse-line {
          0%,
          100% {
            stroke-opacity: 0.15;
          }
          50% {
            stroke-opacity: 0.6;
          }
        }
      `}</style>
    </section>
  )
}
