'use client'

/**
 * PaymentCheckout — Reusable checkout form for Be[Country] payments
 *
 * Uses the PaymentPlug system to auto-select the right payment method
 * based on the user's country. Shows available methods as selectable pills
 * and collects the appropriate identifier (phone / email / IBAN).
 */

import { useState } from 'react'
import { CreditCard, Phone, Building2, Check, AlertCircle, Loader2 } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import { getPaymentPlugs, type PaymentPlug } from '@/lib/payments'

// ─── Props ───────────────────────────────────────────────────────────

interface PaymentCheckoutProps {
  amount: number
  currency: string
  pathId?: string
  description: string
  onSuccess: () => void
  onCancel: () => void
}

// ─── Icon map ────────────────────────────────────────────────────────

const PLUG_ICONS: Record<string, typeof CreditCard> = {
  mpesa: Phone,
  stripe: CreditCard,
  sepa: Building2,
  flutterwave: CreditCard,
}

function getPlugIcon(plugId: string) {
  return PLUG_ICONS[plugId] ?? CreditCard
}

// ─── Component ───────────────────────────────────────────────────────

type CheckoutState = 'idle' | 'loading' | 'success' | 'error'

export default function PaymentCheckout({
  amount,
  currency,
  pathId,
  description,
  onSuccess,
  onCancel,
}: PaymentCheckoutProps) {
  const { identity } = useIdentity()
  const { t } = useTranslation()

  const plugs = getPaymentPlugs(identity.country)
  const [selectedPlug, setSelectedPlug] = useState<PaymentPlug>(plugs[0])
  const [identifier, setIdentifier] = useState('')
  const [state, setState] = useState<CheckoutState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const Icon = getPlugIcon(selectedPlug.id)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!identifier.trim()) return

    setState('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plugId: selectedPlug.id,
          amount,
          currency,
          description,
          pathId,
          payerIdentifier: identifier.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Payment failed')
      }

      setState('success')
      setTimeout(onSuccess, 2000)
    } catch (err) {
      setState('error')
      setErrorMessage(
        err instanceof Error
          ? err.message
          : t('payment.error') || 'Something went wrong. Please try again.'
      )
    }
  }

  // ─── Success state ─────────────────────────────────────────────────

  if (state === 'success') {
    return (
      <GlassCard variant="featured" padding="lg" className="max-w-md mx-auto text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            {t('payment.success.title') || 'Payment Successful'}
          </h3>
          <p className="text-white/60">
            {t('payment.success.message') || 'Your payment has been processed.'}
          </p>
          <p className="text-brand-accent font-bold text-lg">{selectedPlug.formatAmount(amount)}</p>
        </div>
      </GlassCard>
    )
  }

  // ─── Form state ────────────────────────────────────────────────────

  return (
    <GlassCard variant="featured" padding="lg" className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white">
            {t('payment.title') || 'Complete Payment'}
          </h3>
          <p className="text-white/60 text-sm mt-1">{description}</p>
          <p className="text-brand-accent font-bold text-2xl mt-3">
            {selectedPlug.formatAmount(amount)}
          </p>
        </div>

        {/* Payment method pills */}
        {plugs.length > 1 && (
          <div>
            <label className="text-white/60 text-sm mb-2 block">
              {t('payment.method') || 'Payment Method'}
            </label>
            <div className="flex gap-2 flex-wrap">
              {plugs.map((plug) => {
                const PillIcon = getPlugIcon(plug.id)
                const isActive = plug.id === selectedPlug.id
                return (
                  <button
                    key={plug.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlug(plug)
                      setIdentifier('')
                      setErrorMessage('')
                      setState('idle')
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-accent text-brand-bg'
                        : 'bg-brand-surface text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <PillIcon className="w-4 h-4" />
                    {plug.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Identifier input */}
        <div>
          <label htmlFor="payer-id" className="text-white/60 text-sm mb-2 block">
            {selectedPlug.identifierLabel}
          </label>
          <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              id="payer-id"
              type={selectedPlug.identifierType === 'email' ? 'email' : 'text'}
              inputMode={selectedPlug.identifierType === 'phone' ? 'tel' : 'text'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={selectedPlug.identifierPlaceholder}
              required
              disabled={state === 'loading'}
              className="w-full bg-brand-bg border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Error message */}
        {state === 'error' && errorMessage && (
          <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-1">
          <button
            type="submit"
            disabled={state === 'loading' || !identifier.trim()}
            className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('payment.processing') || 'Processing...'}
              </>
            ) : (
              <>
                {t('payment.pay') || 'Pay'} {selectedPlug.formatAmount(amount)}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={state === 'loading'}
            className="w-full py-3 rounded-lg text-white/60 hover:text-white transition-colors text-sm disabled:opacity-50"
          >
            {t('payment.cancel') || 'Cancel'}
          </button>
        </div>
      </form>
    </GlassCard>
  )
}
