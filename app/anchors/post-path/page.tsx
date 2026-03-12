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
import { useTranslation } from '@/lib/hooks/use-translation'
import GlassCard from '@/components/ui/GlassCard'

// ─── Derived ──────────────────────────────────────────────────────────────────

const ORIGIN_COUNTRIES = COUNTRY_OPTIONS.map((c) => ({
  code: c.code,
  label: c.name,
  flag: c.flag,
}))

// ─── Path type i18n mapping ──────────────────────────────────────────────────

const PATH_TYPE_KEYS = ['Full Path', 'Part Path', 'Seasonal Path'] as const
const PATH_TYPE_I18N: Record<string, string> = {
  'Full Path': 'postPath.fullPath',
  'Part Path': 'postPath.partPath',
  'Seasonal Path': 'postPath.seasonalPath',
}

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
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-phi-2xl font-bold text-white">{t('postPath.nameYourPath')}</h2>
        <p className="text-gray-400 mt-1">{t('postPath.nameDesc')}</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('postPath.pathTitle')} *
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder={t('postPath.pathTitlePlaceholder')}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent text-lg"
        />
        <p className="text-xs text-gray-400 mt-1.5">{t('postPath.pathTitleHint')}</p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('postPath.pathCategory')} *
        </label>
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
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('postPath.pathType')} *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {PATH_TYPE_KEYS.map((pt) => (
            <button
              key={pt}
              onClick={() => setForm((f) => ({ ...f, pathType: pt }))}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                form.pathType === pt
                  ? 'border-brand-accent bg-brand-primary/20 text-brand-accent'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
              }`}
            >
              {t(PATH_TYPE_I18N[pt])}
            </button>
          ))}
        </div>
      </div>

      {/* Location + remote */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-3.5 h-3.5 inline mr-1" />
            {t('postPath.location')} *
          </label>
          <input
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder={t('postPath.locationPlaceholder')}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Wifi className="w-3.5 h-3.5 inline mr-1" />
            {t('postPath.remotePossible')}
          </label>
          <div className="flex gap-3 mt-1">
            {[
              { val: false, key: 'postPath.onSiteOnly' },
              { val: true, key: 'postPath.remoteOk' },
            ].map((opt) => (
              <button
                key={String(opt.val)}
                onClick={() => setForm((f) => ({ ...f, isRemote: opt.val }))}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                  form.isRemote === opt.val
                    ? 'border-brand-accent bg-brand-primary/30 text-brand-accent'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                {t(opt.key)}
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
  const { t } = useTranslation()
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
        <h2 className="text-phi-2xl font-bold text-white">{t('postPath.tellStory')}</h2>
        <p className="text-gray-400 mt-1">{t('postPath.tellStoryDesc')}</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('postPath.pathDescription')} *
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Describe the opportunity. What will the Pioneer do? What does a day look like? What impact will they make? What makes your anchor unique?

Don't just list tasks — tell the story of this path."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent min-h-[200px] resize-y text-sm leading-relaxed"
        />
        <div className="flex justify-between mt-1.5">
          <p className="text-xs text-gray-400">{t('postPath.descriptionHint')}</p>
          <span className="text-xs text-gray-600">
            {t('postPath.chars', { count: String(form.description.length) })}
          </span>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('postPath.requirements')}
        </label>
        <div className="flex gap-2 mb-3">
          <input
            value={reqInput}
            onChange={(e) => setReqInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addReq())}
            placeholder={t('postPath.addReqPlaceholder')}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent text-sm"
          />
          <button
            onClick={addReq}
            className="px-4 py-2.5 bg-gray-700 text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-600 transition-colors border border-gray-600 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {t('postPath.add')}
          </button>
        </div>

        {form.requirements.length > 0 && (
          <div className="space-y-2">
            {form.requirements.map((req, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 bg-gray-800 rounded-xl border border-gray-700"
              >
                <Check className="w-4 h-4 text-brand-accent flex-shrink-0" />
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
          <p className="text-xs text-gray-600 italic">{t('postPath.noReqYet')}</p>
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
  const { t } = useTranslation()
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
        <h2 className="text-phi-2xl font-bold text-white">{t('postPath.whatSkills')}</h2>
        <p className="text-gray-400 mt-1">{t('postPath.whatSkillsDesc')}</p>
      </div>

      {/* Skill input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('postPath.addSkills')}
        </label>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
            placeholder={t('postPath.typeSkill')}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent text-sm"
          />
          <button
            onClick={() => addSkill(skillInput)}
            className="px-4 py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {t('postPath.add')}
          </button>
        </div>
      </div>

      {/* Added skills */}
      {form.skills.length > 0 && (
        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
            {t('postPath.selectedSkills', { count: String(form.skills.length) })}
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
            {t('postPath.suggestedFor', {
              category: PATH_CATEGORIES.find((c) => c.id === form.category)?.label || 'this path',
            })}
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
          {t('postPath.addOneSkill')}
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
  const { t } = useTranslation()

  const togglePioneerType = (type: PioneerType) => {
    setForm((f) => ({
      ...f,
      targetPioneerTypes: f.targetPioneerTypes.includes(type)
        ? f.targetPioneerTypes.filter((pt) => pt !== type)
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
        <h2 className="text-phi-2xl font-bold text-white">{t('postPath.whoIsFor')}</h2>
        <p className="text-gray-400 mt-1">{t('postPath.whoIsForDesc')}</p>
      </div>

      {/* Pioneer types */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('postPath.pioneerTypes')}
        </label>
        <p className="text-xs text-gray-400 mb-3">{t('postPath.pioneerTypesHint')}</p>
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
                    ? 'border-brand-accent bg-brand-primary/30 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{cfg.icon}</span>
                  {selected && <Check className="w-4 h-4 text-brand-accent" />}
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
          {t('postPath.preferredOrigins')}
        </label>
        <p className="text-xs text-gray-400 mb-3">{t('postPath.preferredOriginsHint')}</p>
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
  const { t } = useTranslation()

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
        <h2 className="text-phi-2xl font-bold text-white">{t('postPath.whatPay')}</h2>
        <p className="text-gray-400 mt-1">{t('postPath.whatPayDesc')}</p>
      </div>

      {/* Salary range */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('postPath.compensationRange')}
        </label>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">{t('postPath.minimum')}</label>
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
            <label className="block text-xs text-gray-400 mb-1">{t('postPath.maximum')}</label>
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
            <label className="block text-xs text-gray-400 mb-1">{t('postPath.currency')}</label>
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
        <p className="text-xs text-gray-400 mt-1.5">{t('postPath.compHint')}</p>
      </div>

      {/* Payment methods */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('postPath.paymentMethods')}
        </label>
        <p className="text-xs text-gray-400 mb-3">{t('postPath.paymentMethodsHint')}</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {PAYMENT_ACCEPTED.map((pm) => {
            const selected = form.paymentMethods.includes(pm.id)
            return (
              <button
                key={pm.id}
                onClick={() => togglePayment(pm.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  selected
                    ? 'border-brand-accent bg-brand-primary/30'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <span className="text-xl">{pm.icon}</span>
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${selected ? 'text-brand-accent' : 'text-gray-300'}`}
                  >
                    {pm.label}
                  </div>
                  <div className="text-xs text-gray-400">{pm.desc}</div>
                </div>
                {selected && <Check className="w-4 h-4 text-brand-accent flex-shrink-0" />}
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
  const { t } = useTranslation()
  const cat = PATH_CATEGORIES.find((c) => c.id === form.category)

  const compensationLabel = (() => {
    if (!form.salaryMin && !form.salaryMax) return t('postPath.compDiscussed')
    if (form.salaryMin && form.salaryMax)
      return `${form.currency} ${Number(form.salaryMin).toLocaleString()} – ${Number(form.salaryMax).toLocaleString()}`
    if (form.salaryMin)
      return t('postPath.compFrom', {
        currency: form.currency,
        amount: Number(form.salaryMin).toLocaleString(),
      })
    return t('postPath.compUpTo', {
      currency: form.currency,
      amount: Number(form.salaryMax).toLocaleString(),
    })
  })()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-phi-2xl font-bold text-white">{t('postPath.reviewPath')}</h2>
        <p className="text-gray-400 mt-1">{t('postPath.reviewPathDesc')}</p>
      </div>

      {/* Path preview card */}
      <GlassCard variant="featured" padding="none" className="overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-700 border border-gray-600 flex items-center justify-center text-3xl flex-shrink-0">
              {cat?.icon || '🌍'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white">
                {form.title || t('postPath.pathTitle')}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.pathType && (
                  <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full border border-gray-600">
                    {t(PATH_TYPE_I18N[form.pathType] ?? 'postPath.fullPath')}
                  </span>
                )}
                {cat && (
                  <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full border border-gray-600">
                    {cat.label}
                  </span>
                )}
                {form.isRemote && (
                  <span className="text-xs px-2 py-1 bg-brand-primary/30 text-brand-accent rounded-full border border-brand-accent/30">
                    {t('postPath.remoteOk')}
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
            <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              {t('postPath.aboutThisPath')}
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap line-clamp-6">
              {form.description}
            </p>
          </div>
        )}

        {/* Requirements */}
        {form.requirements.length > 0 && (
          <div className="p-6 border-b border-gray-700">
            <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
              {t('postPath.requirements')}
            </h4>
            <ul className="space-y-1.5">
              {form.requirements.map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-brand-accent flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {form.skills.length > 0 && (
          <div className="p-6 border-b border-gray-700">
            <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
              {t('postPath.skillsNeeded')}
            </h4>
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
                  {t('postPath.pioneerTypes')}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {form.targetPioneerTypes.map((pt) => (
                    <span
                      key={pt}
                      className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full border border-gray-600"
                    >
                      {PIONEER_TYPES[pt].icon} {PIONEER_TYPES[pt].label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {form.paymentMethods.length > 0 && (
              <div>
                <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                  {t('postPath.paymentMethods')}
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
      </GlassCard>

      {/* Publish CTA */}
      <div className="bg-gradient-to-r from-brand-primary/40 to-brand-primary/40 rounded-2xl border border-brand-accent/30 p-6 text-center">
        <Rocket className="w-8 h-8 text-brand-accent mx-auto mb-3" />
        <h3 className="text-white font-bold text-lg mb-1">{t('postPath.readyToOpen')}</h3>
        <p className="text-gray-400 text-sm mb-5">{t('postPath.readyDesc')}</p>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="px-8 py-4 bg-brand-accent text-white rounded-xl font-bold text-base hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t('postPath.openingPath')}
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              {t('postPath.openThisPath')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PostPathPage() {
  const { t } = useTranslation()
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
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 ambient-glow">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-900/50 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t('postPath.pathIsOpen')}</h1>
          <p className="text-gray-400 mb-6">
            {t('postPath.compassRouting', { title: form.title })}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/anchors/dashboard"
              className="px-5 py-3 bg-brand-accent text-white rounded-xl font-medium hover:opacity-90 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              {t('postPath.goToDashboard')}
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
              {t('postPath.openAnother')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top nav */}
      <nav className="sticky top-16 z-40 glass-subtle border-b border-brand-accent/10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href="/anchors/dashboard"
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="text-white font-semibold text-sm">{t('postPath.openNew')}</div>
            <div className="text-xs text-gray-400">{t('postPath.subtitle')}</div>
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
                      ? 'border-brand-accent bg-brand-accent text-brand-bg'
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
                    step > s.num ? 'bg-brand-accent' : 'bg-gray-700'
                  }`}
                  style={{ minWidth: '20px' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content — pb-32 for fixed bottom nav clearance */}
        <div className="mb-8 pb-24">
          {step === 1 && <StepBasics form={form} setForm={setForm} />}
          {step === 2 && <StepDescription form={form} setForm={setForm} />}
          {step === 3 && <StepSkills form={form} setForm={setForm} />}
          {step === 4 && <StepPioneers form={form} setForm={setForm} />}
          {step === 5 && <StepCompensation form={form} setForm={setForm} />}
          {step === 6 && (
            <StepPreview form={form} onSubmit={handleSubmit} submitting={submitting} />
          )}
        </div>

        {/* Fixed bottom navigation — always visible, never scroll to find */}
        {step < 6 && (
          <div className="fixed bottom-0 left-0 right-0 bg-brand-bg/95 backdrop-blur border-t border-brand-accent/10 z-40">
            <div className="max-w-4xl 3xl:max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
              {step > 1 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="btn-ghost btn-sm flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('postPath.back')}
                </button>
              ) : (
                <div />
              )}

              <span className="text-xs text-gray-500 flex-1 text-center">
                {t('postPath.stepOf', { step: String(step) })}
              </span>

              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className={`btn-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-2 ${
                  canProceed() ? 'btn-primary' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {step === 5 ? (
                  <>
                    {t('postPath.previewPath')}
                    <Eye className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    {t('postPath.continue')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
