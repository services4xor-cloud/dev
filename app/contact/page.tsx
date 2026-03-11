'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, MessageSquare, CheckCircle, Globe } from 'lucide-react'

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
      <div className="max-w-4xl 3xl:max-w-6xl mx-auto px-4 xl:px-8 py-16">
        <div className="text-center mb-12">
          <MessageSquare className="w-12 h-12 text-brand-accent mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl 3xl:text-5xl font-black text-white mb-2">
            Get in touch
          </h1>
          <p className="text-gray-400">We respond within 24 hours on business days</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'hello@bekenya.com', sub: 'General enquiries' },
              {
                icon: Phone,
                label: 'WhatsApp',
                value: '+254 700 000 000',
                sub: 'Monday–Friday, 8am–6pm EAT',
              },
              { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya', sub: 'Westlands, CBD' },
              {
                icon: Globe,
                label: 'Social',
                value: '@bekenya',
                sub: 'Twitter/X • LinkedIn • Instagram',
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
                    <div className="text-gray-500 text-xs">{item.sub}</div>
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
