'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, MessageSquare, CheckCircle, Globe } from 'lucide-react'
import { CONTACT, BRAND_NAME } from '@/data/mock'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: send via Resend API
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-brand-primary to-brand-bg py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.08),transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto px-4">
          <MessageSquare className="w-14 h-14 text-brand-accent mx-auto mb-5" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
            Get in Touch
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Questions about {BRAND_NAME}? We respond within {CONTACT.responseTime} on business days.
          </p>
        </div>
      </section>

      <div className="max-w-4xl 3xl:max-w-6xl mx-auto px-4 xl:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: CONTACT.email, sub: 'General enquiries' },
              {
                icon: Phone,
                label: 'WhatsApp',
                value: CONTACT.phone,
                sub: CONTACT.businessHours,
              },
              {
                icon: MapPin,
                label: 'Location',
                value: CONTACT.location,
                sub: CONTACT.locationDetail,
              },
              {
                icon: Globe,
                label: 'Social',
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
          <div className="md:col-span-2 bg-gray-900/60 rounded-2xl p-6 shadow-sm border border-gray-800">
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Message sent!</h3>
                <p className="text-gray-400">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input w-full"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input w-full"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input w-full"
                  >
                    <option value="">Select a topic...</option>
                    <option>Path posting help</option>
                    <option>Payment issue</option>
                    <option>Account problem</option>
                    <option>Report a scam</option>
                    <option>Partnership inquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input w-full h-32 resize-none"
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-3">
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
