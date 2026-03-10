'use client'

import { useState } from 'react'
import Link from 'next/link'
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <span className="text-gray-900">Beke</span>
            <span className="text-[#C9A227]">nya</span>
          </Link>
          <Link href="/jobs" className="text-gray-600 hover:text-[#C9A227] text-sm">Browse Jobs</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <MessageSquare className="w-12 h-12 text-[#C9A227] mx-auto mb-4" />
          <h1 className="text-3xl font-black text-gray-900 mb-2">Get in touch</h1>
          <p className="text-gray-500">We respond within 24 hours on business days</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'hello@bekenya.com', sub: 'General enquiries' },
              { icon: Phone, label: 'WhatsApp', value: '+254 700 000 000', sub: 'Monday–Friday, 8am–6pm EAT' },
              { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya', sub: 'Westlands, CBD' },
              { icon: Globe, label: 'Social', value: '@bekenya', sub: 'Twitter/X • LinkedIn • Instagram' },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#5C0A14]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                    <div className="text-gray-700 text-sm">{item.value}</div>
                    <div className="text-gray-400 text-xs">{item.sub}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Contact form */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
                <p className="text-gray-500">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="input w-full" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="input w-full" placeholder="you@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                    className="input w-full">
                    <option value="">Select a topic...</option>
                    <option>Job posting help</option>
                    <option>Payment issue</option>
                    <option>Account problem</option>
                    <option>Report a scam</option>
                    <option>Partnership inquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="input w-full h-32 resize-none" placeholder="Tell us how we can help..."
                    required />
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
