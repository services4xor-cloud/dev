'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const STEPS = [
  { key: 'languages', title: 'What languages do you speak?', placeholder: 'e.g., en, sw, de' },
  {
    key: 'faith',
    title: 'What is your faith or worldview?',
    placeholder: 'e.g., christianity, islam, secular',
  },
  {
    key: 'crafts',
    title: 'What are your skills or crafts?',
    placeholder: 'e.g., technology, agriculture, art',
  },
  {
    key: 'interests',
    title: 'What sectors interest you?',
    placeholder: 'e.g., healthcare, education, tourism',
  },
  {
    key: 'locations',
    title: 'Where are you located or interested in?',
    placeholder: 'e.g., KE, DE, NG',
  },
] as const

export default function OnboardingPage() {
  const { status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Record<string, string[]>>({
    languages: [],
    faith: [],
    crafts: [],
    interests: [],
    locations: [],
  })
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const currentStep = STEPS[step]

  const addItem = () => {
    if (!input.trim()) return
    const key = currentStep.key
    setData((prev) => ({
      ...prev,
      [key]: [...prev[key], input.trim().toLowerCase()],
    }))
    setInput('')
  }

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      setInput('')
    } else {
      submit()
    }
  }

  const removeItem = (key: string, index: number) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }))
  }

  const back = () => {
    if (step > 0) {
      setStep(step - 1)
      setInput('')
    }
  }

  const submit = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        setError('Failed to save. Please try again.')
        setSaving(false)
        return
      }
      router.push('/me')
    } catch {
      setError('Connection error. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-brand-surface p-8">
        <div className="text-center">
          <a href="/" className="text-xs text-brand-text-muted hover:text-brand-accent">
            ← Back to Map
          </a>
          <p className="mt-2 text-xs text-brand-text-muted">
            Step {step + 1} of {STEPS.length}
          </p>
          <h1 className="mt-2 text-xl font-bold text-brand-accent">{currentStep.title}</h1>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder={currentStep.placeholder}
            className="flex-1 rounded-lg border border-brand-accent/20 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text-muted focus:border-brand-accent focus:outline-none"
          />
          <button
            onClick={addItem}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm text-brand-accent"
          >
            Add
          </button>
        </div>

        {data[currentStep.key].length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data[currentStep.key].map((item, i) => (
              <button
                key={i}
                onClick={() => removeItem(currentStep.key, i)}
                className="rounded-full bg-brand-accent/10 px-3 py-1 text-sm text-brand-accent hover:bg-brand-accent/20 transition"
              >
                {item} ✕
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-center text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={back}
              className="rounded-lg border border-brand-accent/20 px-4 py-3 font-medium text-brand-text-muted transition hover:text-brand-text"
            >
              Back
            </button>
          )}
          <button
            onClick={next}
            disabled={saving}
            className="flex-1 rounded-lg bg-brand-primary px-4 py-3 font-medium text-brand-accent transition hover:opacity-90 disabled:opacity-50"
          >
            {step < STEPS.length - 1 ? 'Next' : saving ? 'Saving...' : 'Complete'}
          </button>
        </div>
      </div>
    </div>
  )
}
