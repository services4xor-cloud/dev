/**
 * 4XOR brand mark (wireframe pyramid, teal arc, gold apex) with the Be[X]
 * wordmark. Same 53x60 grid as the 4xor.com logo, so both sites read as one family.
 */
export default function Logo({
  size = 40,
  wordmark = true,
}: {
  size?: number
  wordmark?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-2.5 leading-none">
      <svg
        width={(size * 53) / 60}
        height={size}
        viewBox="0 0 53 60"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M15.3 40.6A12.5 12.5 0 1 1 37.7 40.6"
          stroke="rgb(var(--color-accent-rgb))"
          strokeWidth="2"
        />
        <path
          d="M26.5 8 2.5 47l24 11 24-11ZM26.5 8v50M2.5 47l24-12 24 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="miter"
        />
        <circle cx="26.5" cy="5.5" r="3.75" fill="#d4a537" />
      </svg>
      {wordmark && (
        <span
          className="font-brand font-medium tracking-[0.22em]"
          style={{ fontSize: size * 0.42 }}
        >
          BE[X]
        </span>
      )}
    </span>
  )
}
