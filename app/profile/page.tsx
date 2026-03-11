'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Camera,
  Plus,
  X,
  CheckCircle,
  Upload,
  Globe,
  MapPin,
  Phone,
  Mail,
  Briefcase,
} from 'lucide-react'
import { SKILLS_SUGGESTIONS, MOCK_PROFILE, BRAND_NAME } from '@/data/mock'
import HeroSection from '@/components/HeroSection'
import { useTranslation } from '@/lib/hooks/use-translation'

export default function ProfilePage() {
  const { t } = useTranslation()
  const [skills, setSkills] = useState<string[]>(['TypeScript', 'React'])
  const [skillInput, setSkillInput] = useState('')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({ ...MOCK_PROFILE })

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) setSkills([...skills, skill])
    setSkillInput('')
  }

  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill))

  const handleSave = () => {
    // TODO: PATCH /api/profile
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const profileComplete = [
    form.name,
    form.email,
    form.phone,
    form.bio,
    form.headline,
    skills.length > 0,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-brand-bg">
      <HeroSection
        title={t('profile.title')}
        subtitle={t('profile.subtitle', { brand: BRAND_NAME })}
        size="sm"
      />

      <div className="max-w-3xl 3xl:max-w-5xl mx-auto px-4 py-8">
        {/* Completion bar */}
        <div className="bg-gray-900/60 rounded-2xl p-4 shadow-sm border border-brand-primary/30 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">{t('profile.completeness')}</span>
            <span className="text-sm font-bold text-brand-accent">
              {Math.round((profileComplete / 6) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-brand-accent h-2 rounded-full transition-all"
              style={{ width: `${Math.round((profileComplete / 6) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{t('profile.completeHint')}</p>
        </div>

        {/* Avatar */}
        <div className="bg-gray-900/60 rounded-2xl p-6 shadow-sm border border-brand-primary/30 mb-4">
          <h2 className="font-bold text-white mb-4">{t('profile.photo')}</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {form.name.charAt(0)}
              </div>
              <button
                aria-label="Change profile photo"
                className="absolute bottom-0 right-0 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-white"
              >
                <Camera className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">{t('profile.photoHint')}</p>
              <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                <Upload className="w-3 h-3" aria-hidden="true" /> {t('profile.uploadPhoto')}
              </button>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-gray-900/60 rounded-2xl p-6 shadow-sm border border-brand-primary/30 mb-4">
          <h2 className="font-bold text-white mb-4">{t('profile.basicInfo')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> {t('profile.currentRole')}
              </label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder={t('profile.rolePlaceholder')}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {t('profile.city')}
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Nairobi"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {t('profile.email')}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {t('profile.phone')}
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={t('profile.phonePlaceholder')}
                className="input w-full"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t('profile.bio')}
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder={t('profile.bioPlaceholder')}
              className="input w-full h-24 resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-400 text-right mt-1">{form.bio.length}/500</div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3" /> {t('profile.linkedin')}
            </label>
            <input
              type="url"
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
              placeholder={t('profile.linkedinPlaceholder')}
              className="input w-full"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="bg-gray-900/60 rounded-2xl p-6 shadow-sm border border-brand-primary/30 mb-6">
          <h2 className="font-bold text-white mb-4">{t('profile.skills')}</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1 badge bg-brand-primary/20 text-brand-accent"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:opacity-70"
                  aria-label={`Remove skill: ${skill}`}
                >
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
              placeholder={t('profile.addSkill')}
              className="input flex-1"
            />
            <button
              onClick={() => addSkill(skillInput)}
              className="btn-secondary px-3"
              aria-label="Add skill"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {SKILLS_SUGGESTIONS.filter((s) => !skills.includes(s))
              .slice(0, 8)
              .map((s) => (
                <button
                  key={s}
                  onClick={() => addSkill(s)}
                  className="badge bg-gray-800 text-gray-400 text-xs hover:bg-brand-primary/20 hover:text-brand-accent transition-colors cursor-pointer"
                >
                  + {s}
                </button>
              ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`w-full py-4 text-base rounded-2xl font-semibold transition-all ${saved ? 'bg-green-500 text-white' : 'btn-primary'}`}
        >
          {saved ? (
            <>
              <CheckCircle className="inline w-5 h-5 mr-2" />
              {t('profile.saved')}
            </>
          ) : (
            t('profile.saveProfile')
          )}
        </button>
      </div>
    </div>
  )
}
