'use client'

import { useState } from 'react'
import { X, Phone, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

interface MpesaModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  currency?: string
  description: string
  itemType: 'job_post' | 'premium' | 'referral' | 'venture'
  itemId: string
  onSuccess?: (checkoutRequestId: string) => void
}

type Step = 'input' | 'pending' | 'success' | 'error'

export default function MpesaModal({
  isOpen,
  onClose,
  amount,
  currency = 'KES',
  description,
  itemType,
  itemId,
  onSuccess,
}: MpesaModalProps) {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<Step>('input')
  const [checkoutId, setCheckoutId] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('pending')
    setError('')

    try {
      const res = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount,
          packageId: itemType === 'venture' ? itemId : undefined,
          pathId: itemType === 'job_post' ? itemId : undefined,
          description: description.slice(0, 13),
        }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Payment failed. Please try again.')
        setStep('error')
        return
      }

      setCheckoutId(data.checkoutRequestId)
      setStep('success')
      onSuccess?.(data.checkoutRequestId)
    } catch {
      setError('Network error. Check your connection and try again.')
      setStep('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold">
                M
              </div>
              <span className="font-bold text-lg">M-Pesa</span>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-3xl font-black">
            {currency} {amount.toLocaleString('en-US')}
          </div>
          <div className="text-green-100 text-sm mt-1">{description}</div>
        </div>

        <div className="p-6">
          {step === 'input' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  M-Pesa Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="input pl-10 w-full"
                    pattern="[0-9\+\s]{9,15}"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  You will receive a push notification on your phone
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Send KES {amount.toLocaleString('en-US')} →
              </button>

              <p className="text-xs text-center text-gray-400">
                Secured by Safaricom M-Pesa. Your PIN is never shared.
              </p>
            </form>
          )}

          {step === 'pending' && (
            <div className="text-center py-6">
              <Loader2 className="w-12 h-12 text-green-500 mx-auto mb-4 animate-spin" />
              <h3 className="font-bold text-gray-900 mb-2">Check your phone</h3>
              <p className="text-gray-400 text-sm">
                We sent a payment request to <strong>{phone}</strong>. Enter your M-Pesa PIN to
                complete the payment.
              </p>
              <p className="text-xs text-gray-400 mt-4">This may take up to 30 seconds</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 text-lg mb-2">Payment Initiated!</h3>
              <p className="text-gray-400 text-sm mb-4">
                Check your phone and enter your M-Pesa PIN to complete.
              </p>
              {checkoutId && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2 font-mono break-all">
                  Ref: {checkoutId}
                </p>
              )}
              <button onClick={onClose} className="mt-4 btn-primary w-full py-3">
                Done
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Payment failed</h3>
              <p className="text-gray-400 text-sm mb-4">{error}</p>
              <div className="flex gap-3">
                <button onClick={() => setStep('input')} className="flex-1 btn-primary py-3">
                  Try Again
                </button>
                <button onClick={onClose} className="flex-1 btn-secondary py-3">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
