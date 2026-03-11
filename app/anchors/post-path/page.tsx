'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Check,
  MapPin,
  Globe,
  Wifi,
  Banknote,
  Eye,
  Rocket,
  Users,
  Zap,
  ArrowRight,
} from 'lucide-react'
import { PIONEER_TYPES, PATH_CATEGORIES, type PioneerType } from '@/lib/vocabulary'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import {
  CURRENCIES,
  PAYMENT_ACCEPTED,
  SUGGESTED_SKILLS,
  POST_PATH_STEPS as STEPS,
} from '@/data/mock'

// ─── Derived ──────────────────────────────────────────────────────────────────

const ORIGIN_COUNTRIES = COUNTRY_OPTIONS.map((c) => ({
  code: c.code,
  label: c.name,
  flag: c.flag,
}))

// ─── Types ────────────────────────────────────────────────────────────────────

interface PathForm {
  title: string
  category: string
  pathType: string
  location: string
  isRemote: boolean
  description: string
  requirements: string[]
  skills: string[]
  targetPioneerTypes: PioneerType[]
  preferredOriginCountries: string[]
  salaryMin: string
  salaryMax: string
  currency: string
  paymentMethods: string[]
}

// ─── Chip component ───────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 border border-gray-600 text-gray-200 rounded-full text-sm">
      {label}
      <button onClick={onRemove} className="text-gray-400 hover:text-white transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

// ─── Step 1: Path Basics ──────────────────────────────────────────────────────

function StepBasics({
  form,
  setForm,
}: {
  form: PathForm
  setForm: React.Dispatch<React.SetStateAction<PathForm>>
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Name your Path</h2>
        <p className="text-gray-400 mt-1">
          Give it a title that resonates — Pioneers connect with what they feel.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Path Title *</label>
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="e.g. Senior Wildlife Guide — Big Five Specialist"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent text-lg"
        />
        <p className="text-xs text-gray-400 mt-1.5">
          Be specific. Pioneers scan fast — a precise title wins.
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Path Category *</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PATH_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                form.category === cat.id
                  ? 'border-brand-accent bg-brand-primary/20 text-white'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-sm font-medium">{cat.label}</span>
              {form.category === cat.id && <Check className="w-4 h-4 text-brand-accent ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* Path type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Path Type *</label>
        <div className="grid grid-cols-3 gap-3">
          {['Full Path', 'Part Path', 'Seasonal Path'].map((t) => (
            <button
              key={t}
              onClick={() => setForm((f) => ({ ...f, pathType: t }))}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                form.pathType === t
                  ? 'border-brand-accent bg-brand-primary/20 text-brand-accent'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Location + remote */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-3.5 h-3.5 inline mr-1" />
            Location *
          </label>
          <input
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder="e.g. Laikipia, Kenya"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Wifi className="w-3.5 h-3.5 inline mr-1" />
            Remote Possible?
          </label>
          <div className="flex gap-3 mt-1">
            {[
              { val: false, label: 'On-site only' },
              { val: true, label: 'Remote OK' },
            ].map((opt) => (
              <button
                key={String(opt.val)}
                onClick={() => setForm((f) => ({ ...f, isRemote: opt.val }))}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                  form.isRemote === opt.val
                    ? 'border-teal-500 bg-teal-900/30 text-teal-400'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step 2: Description & Requirements ──────────────────────────────────────

function StepDescription({
  form,
  setForm,
}: {
  form: PathForm
  setForm: React.Dispatch<React.SetStateAction<PathForm>>
}) {
  const [reqInput, setReqInput] = useState('')

  const addReq = () => {
    const val = reqInput.trim()
    if (val && !form.requirements.includes(val)) {
      setForm((f) => ({ ...f, requirements: [...f.requirements, val] }))
      setReqInput('')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Tell Pioneers the story</h2>
        <p className="text-gray-400 mt-1">
          Describe the path — what they will do, experience, and contribute.
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Path Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Describe the opportunity. What will the Pioneer do? What does a day look like? What impact will they make? What makes your anchor unique?

Don't just list tasks — tell the story of this path."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent min-h-[200px] resize-y text-sm leading-relaxed"
        />
        <div className="flex justify-between mt-1.5">
          <p className="text-xs text-gray-400">
            Minimum 100 characters. Compass uses this to match Pioneers.
          </p>
          <span className="text-xs text-gray-600">{form.description.length} chars</span>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Requirements</label>
        <div className="flex gap-2 mb-3">
          <input
            value={reqInput}
            onChange={(e) => setReqInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addReq())}
            placeholder="e.g. Valid driver's licence, e.g. FGASA Level 2+"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent text-sm"
          />
          <button
            onClick={addReq}
            className="px-4 py-2.5 bg-gray-700 text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-600 transition-colors border border-gray-600 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {form.requirements.length > 0 && (
          <div className="space-y-2">
            {form.requirements.map((req, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 bg-gray-800 rounded-xl border border-gray-700"
              >
                <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span className="text-sm text-gray-200 flex-1">{req}</span>
                <button
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      requirements: f.requirements.filter((_, j) => j !== i),
                    }))
                  }
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {form.requirements.length === 0 && (
          <p className="text-xs text-gray-600 italic">
            No requirements added yet. Press Enter or click Add.
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Step 3: Skills ───────────────────────────────────────────────────────────

function StepSkills({
  form,
  setForm,
}: {
  form: PathForm
  setForm: React.Dispatch<React.SetStateAction<PathForm>>
}) {
  const [skillInput, setSkillInput] = useState('')

  const addSkill = (skill: string) => {
    const val = skill.trim()
    if (val && !form.skills.includes(val)) {
      setForm((f) => ({ ...f, skills: [...f.skills, val] }))
    }
    setSkillInput('')
  }

  const suggested = SUGGESTED_SKILLS[form.category] || SUGGESTED_SKILLS.tech
  const notYetAdded = suggested.filter((s) => !form.skills.includes(s))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">What does a great Pioneer bring?</h2>
        <p className="text-gray-400 mt-1">
          Add skills — Compass uses these to surface the best-fit Pioneers for your path.
        </p>
      </div>

      {/* Skill input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Add Skills</label>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
            placeholder="Type a skill and press Enter"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent text-sm"
          />
          <button
            onClick={() => addSkill(skillInput)}
            className="px-4 py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Added skills */}
      {form.skills.length > 0 && (
        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
            Selected Skills ({form.skills.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((s) => (
              <Chip
                key={s}
                label={s}
                onRemove={() => setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {notYetAdded.length > 0 && (
        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-brand-accent" />
            Suggested for{' '}
            {PATH_CATEGORIES.find((c) => c.id === form.category)?.label || 'this path'}
          </label>
          <div className="flex flex-wrap gap-2">
            {notYetAdded.map((s) => (
              <button
                key={s}
                onClick={() => addSkill(s)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 border-dashed text-gray-400 rounded-full text-sm hover:border-brand-accent hover:text-brand-accent transition-colors"
              >
                <Plus className="w-3 h-3" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {form.skills.length === 0 && (
        <div className="p-4 bg-brand-primary/20 border border-brand-primary/30 rounded-xl text-sm text-brand-accent">
          Add at least 1 skill so Compass can find the right Pioneers for this path.
        </div>
      )}
    </div>
  )
}

// ─── Step 4: Pioneer Targeting ────────────────────────────────────────────────

function StepPioneers({
  form,
  setForm,
}: {
  form: PathForm
  setForm: React.Dispatch<React.SetStateAction<PathForm>>
}) {
  const togglePioneerType = (type: PioneerType) => {
    setForm((f) => ({
      ...f,
      targetPioneerTypes: f.targetPioneerTypes.includes(type)
        ? f.targetPioneerTypes.filter((t) => t !== type)
        : [...f.targetPioneerTypes, type],
    }))
  }

  const toggleOrigin = (code: string) => {
    setForm((f) => ({
      ...f,
      preferredOriginCountries: f.preferredOriginCountries.includes(code)
        ? f.preferredOriginCountries.filter((c) => c !== code)
        : [...f.preferredOriginCountries, code],
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Who is this Path for?</h2>
        <p className="text-gray-400 mt-1">Help Compass route the right Pioneers to your path.</p>
      </div>

      {/* Pioneer types */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Pioneer Types</label>
        <p className="text-xs text-gray-400 mb-3">
          Select all types that are a good fit. Leave blank to accept all.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(PIONEER_TYPES) as PioneerType[]).map((type) => {
            const cfg = PIONEER_TYPES[type]
            const selected = form.targetPioneerTypes.includes(type)
            return (
              <button
                key={type}
                onClick={() => togglePioneerType(type)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selected
                    ? 'border-teal-500 bg-teal-900/30 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{cfg.icon}</span>
                  {selected && <Check className="w-4 h-4 text-teal-400" />}
                </div>
                <div className="text-sm font-semibold text-gray-200">{cfg.label}</div>
                <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">{cfg.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Origin countries */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Preferred Pioneer Origins
        </label>
        <p className="text-xs text-gray-400 mb-3">
          Pioneers from these countries will be weighted higher in Compass routing. Leave blank for
          global.
        </p>
        <div className="flex flex-wrap gap-2">
          {ORIGIN_COUNTRIES.map((c) => {
            const selected = form.preferredOriginCountries.includes(c.code)
            return (
              <button
                key={c.code}
                onClick={() => toggleOrigin(c.code)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                  selected
                    ? 'border-brand-accent bg-brand-primary/20 text-brand-accent'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
                {selected && <Check className="w-3.5 h-3.5" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Step 5: Compensation ─────────────────────────────────────────────────────

function StepCompensation({
  form,
  setForm,
}: {
  form: PathForm
  setForm: React.Dispatch<React.SetStateAction<PathForm>>
}) {
  const togglePayment = (id: string) => {
    setForm((f) => ({
      ...f,
      paymentMethods: f.paymentMethods.includes(id)
        ? f.paymentMethods.filter((p) => p !== id)
        : [...f.paymentMethods, id],
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">What does the path pay?</h2>
        <p className="text-gray-400 mt-1">
          Being transparent about compensation attracts committed Pioneers.
        </p>
      </div>

      {/* Salary range */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Compensation Range</label>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Minimum</label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={form.salaryMin}
                onChange={(e) => setForm((f) => ({ ...f, salaryMin: e.target.value }))}
                placeholder="e.g. 80,000"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Maximum</label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={form.salaryMax}
                onChange={(e) => setForm((f) => ({ ...f, salaryMax: e.target.value }))}
                placeholder="e.g. 150,000"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Currency</label>
            <select
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Shown as a range. Leave blank to show &quot;Compensation discussed&quot;.
        </p>
      </div>

      {/* Payment methods */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Payment Methods Accepted
        </label>
        <p className="text-xs text-gray-400 mb-3">
          How will this Pioneer be paid? Select all that apply.
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {PAYMENT_ACCEPTED.map((pm) => {
            const selected = form.paymentMethods.includes(pm.id)
            return (
              <button
                key={pm.id}
                onClick={() => togglePayment(pm.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  selected
                    ? 'border-teal-500 bg-teal-900/30'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <span className="text-xl">{pm.icon}</span>
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${selected ? 'text-teal-300' : 'text-gray-300'}`}
                  >
                    {pm.label}
                  </div>
                  <div className="text-xs text-gray-400">{pm.desc}</div>
                </div>
                {selected && <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Step 6: Preview ──────────────────────────────────────────────────────────

function StepPreview({
  form,
  onSubmit,
  submitting,
}: {
  form: PathForm
  onSubmit: () => void
  submitting: boolean
}) {
  const cat = PATH_CATEGORIES.find((c) => c.id === form.category)

  const compensationLabel = (() => {
    if (!form.salaryMin && !form.salaryMax) return 'Discussed upon offer'
    if (form.salaryMin && form.salaryMax)
      return `${form.currency} ${Number(form.salaryMin).toLocaleString()} – ${Number(form.salaryMax).toLocaleString()}`
    if (form.salaryMin) return `From ${form.currency} ${Number(form.salaryMin).toLocaleString()}`
    return `Up to ${form.currency} ${Number(form.salaryMax).toLocaleString()}`
  })()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Review your Path</h2>
        <p className="text-gray-400 mt-1">
          This is how it will appear to Pioneers in the BeNetwork.
        </p>
      </div>

      {/* Path preview card */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-700 border border-gray-600 flex items-center justify-center text-3xl flex-shrink-0">
              {cat?.icon || '🌍'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white">{form.title || 'Path Title'}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.pathType && (
                  <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full border border-gray-600">
                    {form.pathType}
                  </span>
                )}
                {cat && (
                  <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full border border-gray-600">
                    {cat.label}
                  </span>
                )}
                {form.isRemote && (
                  <span className="text-xs px-2 py-1 bg-teal-900/50 text-teal-400 rounded-full border border-teal-700/50">
                    Remote OK
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                {form.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {form.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5" />
                  {compensationLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {form.description && (
          <div className="p-6 border-b border-gray-700">
            <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">About this Path</h4>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap line-clamp-6">
              {form.description}
            </p>
          </div>
        )}

        {/* Requirements */}
        {form.requirements.length > 0 && (
          <div className="p-6 border-b border-gray-700">
            <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-3">Requirements</h4>
            <ul className="space-y-1.5">
              {form.requirements.map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {form.skills.length > 0 && (
          <div className="p-6 border-b border-gray-700">
            <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-3">Skills Needed</h4>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 bg-gray-700 text-gray-300 rounded-full text-xs border border-gray-600"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pioneer types + origins */}
        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {form.targetPioneerTypes.length > 0 && (
              <div>
                <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                  Pioneer Types
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {form.targetPioneerTypes.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full border border-gray-600"
                    >
                      {PIONEER_TYPES[t].icon} {PIONEER_TYPES[t].label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {form.paymentMethods.length > 0 && (
              <div>
                <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                  Payment Methods
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {form.paymentMethods.map((p) => {
                    const pm = PAYMENT_ACCEPTED.find((x) => x.id === p)
                    return pm ? (
                      <span
                        key={p}
                        className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full border border-gray-600"
                      >
                        {pm.icon} {pm.label}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publish CTA */}
      <div className="bg-gradient-to-r from-brand-primary/40 to-teal-900/40 rounded-2xl border border-brand-accent/30 p-6 text-center">
        <Rocket className="w-8 h-8 text-brand-accent mx-auto mb-3" />
        <h3 className="text-white font-bold text-lg mb-1">Ready to open this Path?</h3>
        <p className="text-gray-400 text-sm mb-5">
          Compass will immediately start matching Pioneers to your path. You&apos;ll see chapters
          arriving in your dashboard.
        </p>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="px-8 py-4 bg-brand-accent text-white rounded-xl font-bold text-base hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Opening Path...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Open This Path
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PostPathPage() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState<PathForm>({
    title: '',
    category: '',
    pathType: 'Full Path',
    location: '',
    isRemote: false,
    description: '',
    requirements: [],
    skills: [],
    targetPioneerTypes: [],
    preferredOriginCountries: [],
    salaryMin: '',
    salaryMax: '',
    currency: 'KES',
    paymentMethods: ['mpesa'],
  })

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          pathType: form.pathType,
          location: form.location,
          isRemote: form.isRemote,
          description: form.description,
          requirements: form.requirements,
          skills: form.skills,
          targetPioneerTypes: form.targetPioneerTypes,
          preferredOriginCountries: form.preferredOriginCountries,
          salaryMin: form.salaryMin ? Number(form.salaryMin.replace(/,/g, '')) : undefined,
          salaryMax: form.salaryMax ? Number(form.salaryMax.replace(/,/g, '')) : undefined,
          currency: form.currency,
          paymentMethods: form.paymentMethods,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      }
    } catch (_err) {
      // fall through to show error state if needed
    } finally {
      setSubmitting(false)
    }
  }

  const canProceed = (): boolean => {
    if (step === 1) return form.title.trim().length >= 3 && !!form.category && !!form.location
    if (step === 2) return form.description.trim().length >= 50
    if (step === 3) return form.skills.length >= 1
    return true
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-900/50 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Path is Open!</h1>
          <p className="text-gray-400 mb-6">
            Compass is now routing Pioneers to <strong className="text-white">{form.title}</strong>.
            You&apos;ll see chapters arriving shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/anchors/dashboard"
              className="px-5 py-3 bg-brand-accent text-white rounded-xl font-medium hover:opacity-90 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Go to Dashboard
            </Link>
            <button
              onClick={() => {
                setSubmitted(false)
                setStep(1)
                setForm((f) => ({ ...f, title: '', description: '' }))
              }}
              className="px-5 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium border border-gray-700 hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Open Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top nav */}
      <nav className="sticky top-16 z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-700/50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href="/anchors/dashboard"
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="text-white font-semibold text-sm">Open a New Path</div>
            <div className="text-xs text-gray-400">
              Opening a Path is how Anchors build their tribe.
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    step > s.num
                      ? 'border-teal-500 bg-teal-500 text-white'
                      : step === s.num
                        ? 'border-brand-accent bg-brand-accent text-white'
                        : 'border-gray-600 bg-gray-800 text-gray-400'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <div
                  className={`text-xs mt-1 font-medium hidden sm:block ${
                    step >= s.num ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {s.label}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 mx-2 sm:mx-3 transition-colors ${
                    step > s.num ? 'bg-teal-500' : 'bg-gray-700'
                  }`}
                  style={{ minWidth: '20px' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="mb-8">
          {step === 1 && <StepBasics form={form} setForm={setForm} />}
          {step === 2 && <StepDescription form={form} setForm={setForm} />}
          {step === 3 && <StepSkills form={form} setForm={setForm} />}
          {step === 4 && <StepPioneers form={form} setForm={setForm} />}
          {step === 5 && <StepCompensation form={form} setForm={setForm} />}
          {step === 6 && (
            <StepPreview form={form} onSubmit={handleSubmit} submitting={submitting} />
          )}
        </div>

        {/* Navigation buttons */}
        {step < 6 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 px-5 py-3 bg-gray-800 text-gray-300 border border-gray-700 rounded-xl font-medium hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl font-semibold hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 5 ? (
                <>
                  Preview Path
                  <Eye className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
