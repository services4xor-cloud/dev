'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, MessageSquare, CheckCircle, Globe } from 'lucide-react'
import { CONTACT, BRAND_NAME } from '@/data/mock'
import HeroSection from '@/components/HeroSection'
import { useTranslation } from '@/lib/hooks/use-translation'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

export default function ContactPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          country: process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE',
        }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSent(true)
    } catch {
      setError(t('contact.error'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <HeroSection
        title={t('contact.title')}
        subtitle={t('contact.subtitle', { brand: BRAND_NAME, time: CONTACT.responseTime })}
        icon={<MessageSquare className="w-14 h-14 text-brand-accent mx-auto" />}
        gradientTitle
      />

      <SectionLayout ambient maxWidth="max-w-4xl 3xl:max-w-6xl">
        <div className="grid md:grid-cols-3 gap-phi-6">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              {
                icon: Mail,
                label: t('contact.labelEmail'),
                value: CONTACT.email,
                sub: t('contact.labelEmailSub'),
              },
              {
                icon: Phone,
                label: t('contact.labelWhatsApp'),
                value: CONTACT.phone,
                sub: CONTACT.businessHours,
              },
              {
                icon: MapPin,
                label: t('contact.labelLocation'),
                value: CONTACT.location,
                sub: CONTACT.locationDetail,
              },
              {
                icon: Globe,
                label: t('contact.labelSocial'),
                value: CONTACT.social,
                sub: CONTACT.socialPlatforms,
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-primary/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{item.label}</div>
                    <div className="text-gray-300 text-sm">{item.value}</div>
                    <div className="text-gray-400 text-xs">{item.sub}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Contact form */}
          <GlassCard padding="lg" className="md:col-span-2">
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-phi-xl font-bold text-white mb-2">{t('contact.sent')}</h3>
                <p className="text-gray-400">{t('contact.sentDesc')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {t('contact.name')}
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input w-full"
                      placeholder={t('contact.namePlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {t('contact.email')}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input w-full"
                      placeholder={t('contact.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('contact.subject')}
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input w-full"
                  >
                    <option value="">{t('contact.subjectPlaceholder')}</option>
                    <option>{t('contact.subjectPath')}</option>
                    <option>{t('contact.subjectPayment')}</option>
                    <option>{t('contact.subjectAccount')}</option>
                    <option>{t('contact.subjectScam')}</option>
                    <option>{t('contact.subjectPartner')}</option>
                    <option>{t('contact.subjectOther')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('contact.message')}
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input w-full h-32 resize-none"
                    placeholder={t('contact.messagePlaceholder')}
                    required
                  />
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full py-3 disabled:opacity-50"
                >
                  {sending ? t('contact.sending') : `${t('contact.send')} →`}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </SectionLayout>
    </div>
  )
}
