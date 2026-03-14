'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface EdgeDisplay {
  id: string
  relation: string
  to: { id: string; type: string; code: string; label: string; icon?: string | null }
}

// Maps each relation to its valid target node type (first one used for add)
const RELATION_CONFIG: Record<string, { targetType: string; placeholder: string; label: string }> =
  {
    SPEAKS: { targetType: 'LANGUAGE', placeholder: 'e.g. Swahili', label: 'Speaks' },
    PRACTICES: { targetType: 'FAITH', placeholder: 'e.g. Islam', label: 'Practices' },
    WORKS_IN: { targetType: 'SECTOR', placeholder: 'e.g. Technology', label: 'Works In' },
    LOCATED_IN: { targetType: 'LOCATION', placeholder: 'e.g. Nairobi', label: 'Located In' },
    HAS_SKILL: { targetType: 'SKILL', placeholder: 'e.g. Python', label: 'Skill' },
    INTERESTED_IN: { targetType: 'SECTOR', placeholder: 'e.g. Finance', label: 'Interested In' },
    BELONGS_TO: { targetType: 'CULTURE', placeholder: 'e.g. Maasai', label: 'Culture' },
  }

const DIMENSION_ORDER = [
  'SPEAKS',
  'LOCATED_IN',
  'WORKS_IN',
  'HAS_SKILL',
  'INTERESTED_IN',
  'PRACTICES',
  'BELONGS_TO',
]

function DimensionGroup({
  relation,
  edges,
  onAdd,
  onRemove,
}: {
  relation: string
  edges: EdgeDisplay[]
  onAdd: (relation: string, targetType: string, targetCode: string) => Promise<string | null>
  onRemove: (edgeId: string, relation: string) => Promise<string | null>
}) {
  const config = RELATION_CONFIG[relation]
  const [expanded, setExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [removeErrors, setRemoveErrors] = useState<Record<string, string>>({})
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (expanded) inputRef.current?.focus()
  }, [expanded])

  const handleAdd = async () => {
    const code = inputValue.trim()
    if (!code) return
    setAdding(true)
    setAddError(null)
    const err = await onAdd(relation, config.targetType, code)
    setAdding(false)
    if (err) {
      setAddError(err)
    } else {
      setInputValue('')
      setExpanded(false)
    }
  }

  const handleRemove = async (edgeId: string) => {
    setRemovingId(edgeId)
    setRemoveErrors((prev) => ({ ...prev, [edgeId]: '' }))
    const err = await onRemove(edgeId, relation)
    setRemovingId(null)
    if (err) {
      setRemoveErrors((prev) => ({ ...prev, [edgeId]: err }))
    }
  }

  const displayLabel = config?.label ?? relation.replace(/_/g, ' ')

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-brand-text-muted">
          {displayLabel}
        </h2>
        {config && (
          <button
            onClick={() => {
              setExpanded((v) => !v)
              setAddError(null)
            }}
            aria-label={`Add ${displayLabel}`}
            className="flex h-5 w-5 items-center justify-center rounded-full border border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10 transition text-xs leading-none"
          >
            {expanded ? '−' : '+'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {edges.map((edge) => (
          <span
            key={edge.id}
            className="group relative flex items-center gap-1 rounded-full border border-brand-accent/20 bg-brand-surface px-3 py-1.5 text-sm text-brand-text"
          >
            {edge.to.icon && <span>{edge.to.icon}</span>}
            {edge.to.label}
            <button
              onClick={() => handleRemove(edge.id)}
              disabled={removingId === edge.id}
              aria-label={`Remove ${edge.to.label}`}
              className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-brand-text-muted hover:bg-brand-accent/20 hover:text-brand-accent transition disabled:opacity-40"
            >
              {removingId === edge.id ? (
                <span className="inline-block h-2.5 w-2.5 animate-spin rounded-full border border-brand-accent border-t-transparent" />
              ) : (
                '×'
              )}
            </button>
            {removeErrors[edge.id] && (
              <span className="absolute left-0 top-full mt-1 whitespace-nowrap text-xs text-red-400">
                {removeErrors[edge.id]}
              </span>
            )}
          </span>
        ))}
      </div>

      {expanded && config && (
        <div className="mt-3 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
              if (e.key === 'Escape') setExpanded(false)
            }}
            placeholder={config.placeholder}
            className="rounded-lg border border-brand-accent/20 bg-brand-surface px-3 py-1.5 text-sm text-brand-text placeholder-brand-text-muted focus:border-brand-accent/50 focus:outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !inputValue.trim()}
            className="rounded-lg bg-brand-primary px-3 py-1.5 text-sm font-medium text-brand-accent hover:opacity-90 disabled:opacity-40 transition"
          >
            {adding ? 'Adding…' : 'Add'}
          </button>
          <button
            onClick={() => {
              setExpanded(false)
              setAddError(null)
              setInputValue('')
            }}
            className="text-sm text-brand-text-muted hover:text-brand-text transition"
          >
            Cancel
          </button>
        </div>
      )}
      {addError && <p className="mt-1 text-xs text-red-400">{addError}</p>}
    </div>
  )
}

function NameEditor({
  initialName,
  onSave,
}: {
  initialName: string
  onSave: (name: string) => Promise<string | null>
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const save = async () => {
    const name = value.trim()
    if (!name || name === initialName) {
      setEditing(false)
      setValue(initialName)
      return
    }
    setSaving(true)
    setError(null)
    const err = await onSave(name)
    setSaving(false)
    if (err) {
      setError(err)
    } else {
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') {
                setEditing(false)
                setValue(initialName)
              }
            }}
            maxLength={100}
            className="rounded-lg border border-brand-accent/40 bg-brand-surface px-3 py-1 text-2xl font-bold text-brand-accent focus:outline-none"
          />
          {saving && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-3xl font-bold text-brand-accent">{value}</h1>
      <button
        onClick={() => setEditing(true)}
        aria-label="Edit name"
        className="text-brand-text-muted hover:text-brand-accent transition"
        title="Edit name"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
    </div>
  )
}

export default function MePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [edges, setEdges] = useState<EdgeDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState<string>('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status !== 'authenticated') return

    setDisplayName(session.user?.name ?? 'Explorer')

    fetch('/api/identity')
      .then((r) => r.json())
      .then((data) => {
        setEdges(data.edges ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [status, router, session])

  const handleAddEdge = async (
    relation: string,
    targetType: string,
    targetCode: string
  ): Promise<string | null> => {
    try {
      const res = await fetch('/api/identity/edges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relation, targetType, targetCode }),
      })
      const data = await res.json()
      if (!res.ok) return data.error ?? 'Failed to add'
      setEdges((prev) => {
        // Avoid duplicates in local state
        if (prev.some((e) => e.id === data.id)) return prev
        return [...prev, data as EdgeDisplay]
      })
      return null
    } catch {
      return 'Network error'
    }
  }

  const handleRemoveEdge = async (edgeId: string, _relation: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/identity/edges', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edgeId }),
      })
      const data = await res.json()
      if (!res.ok) return data.error ?? 'Failed to remove'
      setEdges((prev) => prev.filter((e) => e.id !== edgeId))
      return null
    } catch {
      return 'Network error'
    }
  }

  const handleSaveName = async (name: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/identity', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) return data.error ?? 'Failed to save'
      setDisplayName(data.name)
      return null
    } catch {
      return 'Network error'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <p className="text-brand-text-muted">Loading identity…</p>
      </div>
    )
  }

  // Group edges by relation, preserving order
  const grouped = edges.reduce(
    (acc, edge) => {
      if (!acc[edge.relation]) acc[edge.relation] = []
      acc[edge.relation].push(edge)
      return acc
    },
    {} as Record<string, EdgeDisplay[]>
  )

  // All relations to display: ordered known ones first, then any extras
  const knownWithEdges = DIMENSION_ORDER.filter((r) => grouped[r] && grouped[r].length > 0)
  const extras = Object.keys(grouped).filter((r) => !DIMENSION_ORDER.includes(r))
  // Show all known dimension types (even empty, so user can add to them) + extras
  const relationsToShow = [...DIMENSION_ORDER, ...extras]

  const hasAnyEdges = edges.length > 0

  return (
    <div className="min-h-screen bg-brand-bg p-6">
      <div className="mb-6 flex items-center justify-between">
        <NameEditor initialName={displayName} onSave={handleSaveName} />
        <a href="/" className="text-sm text-brand-text-muted hover:text-brand-accent transition">
          ← Map
        </a>
      </div>

      {!hasAnyEdges && (
        <div className="mb-6 text-center">
          <p className="text-brand-text-muted">No dimensions yet. Add your first one below.</p>
          <a
            href="/onboarding"
            className="mt-4 inline-block rounded-lg bg-brand-primary px-6 py-3 font-medium text-brand-accent"
          >
            Tell us who you are
          </a>
        </div>
      )}

      <div className="space-y-6">
        {relationsToShow.map((relation) => (
          <DimensionGroup
            key={relation}
            relation={relation}
            edges={grouped[relation] ?? []}
            onAdd={handleAddEdge}
            onRemove={handleRemoveEdge}
          />
        ))}
      </div>
    </div>
  )
}
