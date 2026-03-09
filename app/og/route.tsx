import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

// ── Dynamic OG image — 1200×630 ───────────────────────────────────
// Usage:
//   /og                          → default homepage OG
//   /og?title=Maasai+Mara        → experience/path OG
//   /og?title=...&sub=...&type=venture
//
export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const title = searchParams.get('title') || 'Find Where You Belong. Go There.'
  const sub   = searchParams.get('sub')   || 'Ventures · Compass · Community'
  const type  = searchParams.get('type')  || 'platform' // 'platform' | 'venture' | 'path'

  // Tag line per type
  const tag =
    type === 'venture' ? 'Experience' :
    type === 'path'    ? 'Path' :
    type === 'country' ? 'Gate' :
    'BeNetwork'

  return new ImageResponse(
    (
      <div
        style={{
          display:         'flex',
          flexDirection:   'column',
          width:           '1200px',
          height:          '630px',
          background:      '#0A0A0F',
          fontFamily:      'sans-serif',
          position:        'relative',
          overflow:        'hidden',
        }}
      >
        {/* Maroon radial glow top-left */}
        <div
          style={{
            position:    'absolute',
            top:         '-120px',
            left:        '-120px',
            width:       '600px',
            height:      '600px',
            background:  'radial-gradient(circle, rgba(92,10,20,0.6) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Gold radial glow bottom-right */}
        <div
          style={{
            position:    'absolute',
            bottom:      '-80px',
            right:       '-80px',
            width:       '400px',
            height:      '400px',
            background:  'radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Header — logo mark + brand */}
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '16px',
            padding:    '48px 64px 0',
          }}
        >
          {/* Compass mark (inline SVG as img won't work in edge runtime) */}
          <div
            style={{
              width:           '48px',
              height:          '48px',
              position:        'relative',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
            }}
          >
            {/* Simplified compass: 4 diamond points */}
            {/* N gold */}
            <div style={{ position:'absolute', width:0, height:0,
              borderLeft:'7px solid transparent', borderRight:'7px solid transparent',
              borderBottom:'26px solid #C9A227', top:0, left:'17px' }} />
            {/* S gold */}
            <div style={{ position:'absolute', width:0, height:0,
              borderLeft:'7px solid transparent', borderRight:'7px solid transparent',
              borderTop:'26px solid #C9A227', bottom:0, left:'17px' }} />
            {/* E gold */}
            <div style={{ position:'absolute', width:0, height:0,
              borderTop:'7px solid transparent', borderBottom:'7px solid transparent',
              borderLeft:'26px solid #C9A227', right:0, top:'17px' }} />
            {/* W gold */}
            <div style={{ position:'absolute', width:0, height:0,
              borderTop:'7px solid transparent', borderBottom:'7px solid transparent',
              borderRight:'26px solid #C9A227', left:0, top:'17px' }} />
            {/* Center */}
            <div style={{ width:'8px', height:'8px', borderRadius:'50%',
              background:'#F5F0E8', position:'absolute', top:'20px', left:'20px' }} />
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
            <span style={{ color:'#C9A227', fontSize:'18px', fontWeight:700, letterSpacing:'2px' }}>
              Be[Country]
            </span>
            <span style={{ color:'rgba(245,240,232,0.5)', fontSize:'13px', letterSpacing:'1px' }}>
              The BeNetwork
            </span>
          </div>

          {/* Type badge */}
          <div
            style={{
              marginLeft:   'auto',
              background:   'rgba(201,162,39,0.15)',
              border:       '1px solid rgba(201,162,39,0.3)',
              borderRadius: '24px',
              padding:      '6px 16px',
              color:        '#C9A227',
              fontSize:     '13px',
              fontWeight:   600,
              letterSpacing:'1px',
            }}
          >
            {tag}
          </div>
        </div>

        {/* Main title */}
        <div
          style={{
            flex:          1,
            display:       'flex',
            flexDirection: 'column',
            justifyContent:'center',
            padding:       '0 64px',
            gap:           '16px',
          }}
        >
          <div
            style={{
              fontSize:    title.length > 40 ? '52px' : '64px',
              fontWeight:  800,
              color:       '#F5F0E8',
              lineHeight:  1.1,
              maxWidth:    '900px',
            }}
          >
            {title}
          </div>
          <div style={{ fontSize:'22px', color:'rgba(245,240,232,0.55)', fontWeight:400 }}>
            {sub}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display:       'flex',
            alignItems:    'center',
            justifyContent:'space-between',
            padding:       '0 64px 48px',
          }}
        >
          <span style={{ color:'rgba(245,240,232,0.35)', fontSize:'14px' }}>
            bekenya.com
          </span>
          <span style={{ color:'rgba(201,162,39,0.5)', fontSize:'14px' }}>
            Pioneers · Anchors · Compass
          </span>
        </div>

        {/* Bottom maroon line */}
        <div
          style={{
            position:   'absolute',
            bottom:     0,
            left:       0,
            right:      0,
            height:     '4px',
            background: 'linear-gradient(90deg, #5C0A14, #C9A227, #5C0A14)',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
