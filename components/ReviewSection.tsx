'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface ReviewAuthor {
  name: string | null
  image: string | null
}

interface Review {
  id: string
  rating: number
  content: string
  createdAt: string
  nodeId: string | null
  author: ReviewAuthor
}

interface ReviewsResponse {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

function StarRow({
  rating,
  interactive,
  onSelect,
}: {
  rating: number
  interactive?: boolean
  onSelect?: (r: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  const display = interactive ? hovered || rating : rating

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => onSelect?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={
            interactive
              ? 'text-lg leading-none focus:outline-none'
              : 'text-sm leading-none cursor-default'
          }
          aria-label={interactive ? `Rate ${star} out of 5` : undefined}
        >
          <span className={star <= display ? 'text-brand-accent' : 'text-brand-text-muted/40'}>
            ★
          </span>
        </button>
      ))}
    </div>
  )
}

function AvatarSmall({ name, image }: { name: string | null; image: string | null }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name ?? ''} className="h-8 w-8 rounded-full object-cover" />
  }
  const initials = (name ?? '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-brand-accent text-xs font-bold select-none flex-shrink-0">
      {initials || '?'}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface ReviewSectionProps {
  targetId: string
  showForm?: boolean
}

export default function ReviewSection({ targetId, showForm = false }: ReviewSectionProps) {
  const { data: session } = useSession()
  const [data, setData] = useState<ReviewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reviews?targetId=${encodeURIComponent(targetId)}`)
      if (res.ok) {
        const json = (await res.json()) as ReviewsResponse
        setData(json)
      }
    } finally {
      setLoading(false)
    }
  }, [targetId])

  useEffect(() => {
    void fetchReviews()
  }, [fetchReviews])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (rating === 0) {
      setError('Please select a rating.')
      return
    }
    if (content.trim().length === 0) {
      setError('Please write a review.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId, rating, content }),
      })

      if (!res.ok) {
        const body = (await res.json()) as { error?: string }
        setError(body.error ?? 'Failed to submit review.')
        return
      }

      setRating(0)
      setContent('')
      setFormOpen(false)
      await fetchReviews()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      await fetchReviews()
    } finally {
      setDeletingId(null)
    }
  }

  const canShowForm = showForm && !!session?.user

  return (
    <section className="mt-8 border-t border-brand-accent/10 pt-8">
      <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-brand-text">Reviews</h2>
          {data && (
            <div className="mt-1 flex items-center gap-2">
              <StarRow rating={Math.round(data.averageRating)} />
              <span className="text-sm text-brand-text-muted">
                {data.averageRating > 0 ? data.averageRating.toFixed(1) : '—'}{' '}
                <span className="text-brand-text-muted/60">
                  ({data.totalReviews} {data.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </span>
            </div>
          )}
        </div>

        {canShowForm && !formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-lg border border-brand-accent/30 px-4 py-2 text-sm font-medium text-brand-accent hover:bg-brand-accent/10 transition"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review form */}
      {canShowForm && formOpen && (
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="mb-6 rounded-xl border border-brand-accent/20 bg-brand-surface p-4"
        >
          <h3 className="mb-3 text-sm font-semibold text-brand-text">Your Review</h3>

          <div className="mb-3">
            <label className="mb-1 block text-xs text-brand-text-muted">Rating</label>
            <StarRow rating={rating} interactive onSelect={setRating} />
          </div>

          <div className="mb-3">
            <label htmlFor="review-content" className="mb-1 block text-xs text-brand-text-muted">
              Review
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Share your experience…"
              className="w-full resize-none rounded-lg border border-brand-accent/20 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text-muted/50 focus:border-brand-accent/50 focus:outline-none"
            />
            <p className="mt-0.5 text-right text-xs text-brand-text-muted/60">
              {content.length}/500
            </p>
          </div>

          {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-accent hover:bg-brand-primary/80 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false)
                setError(null)
                setRating(0)
                setContent('')
              }}
              className="rounded-lg border border-brand-accent/20 px-4 py-2 text-sm text-brand-text-muted hover:text-brand-text transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Review list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="text-sm text-brand-text-muted">Loading reviews…</span>
        </div>
      ) : data && data.reviews.length > 0 ? (
        <ul className="space-y-4">
          {data.reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border border-brand-accent/10 bg-brand-surface p-4"
            >
              <div className="flex items-start gap-3">
                <AvatarSmall name={review.author.name} image={review.author.image} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-brand-text">
                        {review.author.name ?? 'Anonymous'}
                      </span>
                      <StarRow rating={review.rating} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-brand-text-muted/60">
                        {formatDate(review.createdAt)}
                      </span>
                      {session?.user?.id && (
                        // We can only delete our own — the API enforces this
                        // Show button only if current user wrote it (we don't have authorId in response, so show for all logged-in, let API reject)
                        <button
                          onClick={() => void handleDelete(review.id)}
                          disabled={deletingId === review.id}
                          className="text-xs text-brand-text-muted/40 hover:text-red-400 transition disabled:opacity-50"
                          aria-label="Delete review"
                        >
                          {deletingId === review.id ? '…' : '✕'}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-brand-text-muted leading-relaxed">
                    {review.content}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-sm text-brand-text-muted">
          No reviews yet. Be the first to leave one.
        </p>
      )}
    </section>
  )
}
