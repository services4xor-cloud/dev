import { PIN_COLORS } from '@/lib/pin-colors'

/** Small coloured dot matching the offering's pin on the map. */
export default function KindDot({ kind }: { kind: string }) {
  return (
    <i
      aria-hidden="true"
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-black/30"
      style={{ background: PIN_COLORS[kind] ?? '#7fb8a6' }}
    />
  )
}
