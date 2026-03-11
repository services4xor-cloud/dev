import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

// ── OG Image Brand Colors ─────────────────────────────────────────
// Satori (server-side PNG) can't use CSS vars.
// Keep in sync with globals.css :root palette.
const OG_COLORS = {
  primary: '#5C0A14',
  accent: '#C9A227',
  bg: '#0A0A0F',
  text: '#F5F0E8',
} as const

// ── Dynamic OG image — 1200×630 ───────────────────────────────────
// Usage:
//   /og                          → default homepage OG
//   /og?title=Maasai+Mara        → experience/path OG
//   /og?title=...&sub=...&type=venture
//
export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const title = searchParams.get('title') || 'Find Where You Belong. Go There.'
  const sub = searchParams.get('sub') || 'Ventures · Compass · Community'
  const type = searchParams.get('type') || 'platform' // 'platform' | 'venture' | 'path'

  // Tag line per type
  const tag =
    type === 'venture'
      ? 'Experience'
      : type === 'path'
        ? 'Path'
        : type === 'country'
          ? 'Gate'
          : 'BeNetwork'

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        background: OG_COLORS.bg,
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Maroon radial glow top-left */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '-120px',
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, ${OG_COLORS.primary}99 0%, transparent 70%)`,
          borderRadius: '50%',
        }}
      />

      {/* Gold radial glow bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${OG_COLORS.accent}26 0%, transparent 70%)`,
          borderRadius: '50%',
        }}
      />

      {/* Header — logo mark + brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '48px 64px 0',
        }}
      >
        {/* Compass mark (inline SVG as img won't work in edge runtime) */}
        <div
          style={{
            width: '48px',
            height: '48px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Simplified compass: 4 diamond points */}
          {/* N */}
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderBottom: `26px solid ${OG_COLORS.accent}`,
              top: 0,
              left: '17px',
            }}
          />
          {/* S */}
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: `26px solid ${OG_COLORS.accent}`,
              bottom: 0,
              left: '17px',
            }}
          />
          {/* E */}
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: `26px solid ${OG_COLORS.accent}`,
              right: 0,
              top: '17px',
            }}
          />
          {/* W */}
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderRight: `26px solid ${OG_COLORS.accent}`,
              left: 0,
              top: '17px',
            }}
          />
          {/* Center */}
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: OG_COLORS.text,
              position: 'absolute',
              top: '20px',
              left: '20px',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span
            style={{
              color: OG_COLORS.accent,
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '2px',
            }}
          >
            Be[Country]
          </span>
          <span style={{ color: `${OG_COLORS.text}80`, fontSize: '13px', letterSpacing: '1px' }}>
            The BeNetwork
          </span>
        </div>

        {/* Type badge */}
        <div
          style={{
            marginLeft: 'auto',
            background: `${OG_COLORS.accent}26`,
            border: `1px solid ${OG_COLORS.accent}4D`,
            borderRadius: '24px',
            padding: '6px 16px',
            color: OG_COLORS.accent,
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '1px',
          }}
        >
          {tag}
        </div>
      </div>

      {/* Main title */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 64px',
          gap: '16px',
        }}
      >
        <div
          style={{
            fontSize: title.length > 40 ? '52px' : '64px',
            fontWeight: 800,
            color: OG_COLORS.text,
            lineHeight: 1.1,
            maxWidth: '900px',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: '22px', color: `${OG_COLORS.text}8C`, fontWeight: 400 }}>{sub}</div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 64px 48px',
        }}
      >
        <span style={{ color: `${OG_COLORS.text}59`, fontSize: '14px' }}>bekenya.com</span>
        <span style={{ color: `${OG_COLORS.accent}80`, fontSize: '14px' }}>
          Pioneers · Anchors · Compass
        </span>
      </div>

      {/* Bottom brand line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${OG_COLORS.primary}, ${OG_COLORS.accent}, ${OG_COLORS.primary})`,
        }}
      />
    </div>,
    { width: 1200, height: 630 }
  )
}
