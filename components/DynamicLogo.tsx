'use client'

/**
 * DynamicLogo — renders an SVG logo that adapts to the current identity.
 *
 * Instead of a static logo file, this generates a crisp SVG with:
 * - The identity's icon/emoji (flag, animal, city icon)
 * - Brand colors (maroon background, gold accent ring)
 * - Scales to any size via `size` prop
 *
 * Used in Nav, Footer, og:image, and anywhere the brand mark appears.
 */

interface DynamicLogoProps {
  /** Icon to display (emoji string) */
  icon: string
  /** Size in pixels */
  size?: number
  /** Additional CSS classes */
  className?: string
}

export default function DynamicLogo({ icon, size = 28, className = '' }: DynamicLogoProps) {
  // Font size scales with container — emoji should fill ~60% of the circle
  const fontSize = Math.round(size * 0.55)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      {/* Background circle — brand primary */}
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill="var(--color-primary, #5C0A14)" />

      {/* Accent ring — gold */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 1.5}
        fill="none"
        stroke="var(--color-accent, #C9A227)"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Identity icon (emoji) */}
      <text x="50%" y="52%" dominantBaseline="central" textAnchor="middle" fontSize={fontSize}>
        {icon}
      </text>
    </svg>
  )
}
