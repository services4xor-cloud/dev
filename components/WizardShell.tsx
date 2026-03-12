'use client'

/**
 * WizardShell — Shared multi-step wizard layout
 *
 * Provides:
 *   - Step progress indicator (numbered circles + connector lines)
 *   - Back / Continue navigation buttons
 *   - Scroll-to-top on step change
 *   - Optional hero header
 *
 * Used by: Compass (4 steps), Onboarding (5 steps), Post-Path (6 steps)
 *
 * The shell manages layout only — step content and form state
 * belong to the parent page component.
 */

import { useEffect, type ReactNode } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

export interface WizardStep {
  /** Short label shown below step circle (e.g. "Destinations") */
  label: string
  /** Optional icon shown instead of number when step is current */
  icon?: ReactNode
}

export interface WizardShellProps {
  /** Step definitions — length determines total steps */
  steps: WizardStep[]
  /** Current step (1-based) */
  currentStep: number
  /** Called when user clicks Back or Continue */
  onStepChange: (step: number) => void
  /** Whether the Continue button should be enabled */
  canContinue?: boolean
  /** Content to render for the current step */
  children: ReactNode
  /** Optional hero content above the progress bar */
  hero?: ReactNode
  /** Label for the final step's continue button (default: "Finish") */
  finishLabel?: string
  /** Called when user clicks the final step button */
  onFinish?: () => void
  /** Whether the final submit is in progress */
  submitting?: boolean
  /** Hide back/continue footer (e.g. when step handles its own navigation) */
  hideNav?: boolean
  /** Max width class (default: "max-w-3xl 3xl:max-w-5xl") */
  maxWidth?: string
}

// ── Component ────────────────────────────────────────────────────────────────

export default function WizardShell({
  steps,
  currentStep,
  onStepChange,
  canContinue = true,
  children,
  hero,
  finishLabel = 'Finish',
  onFinish,
  submitting = false,
  hideNav = false,
  maxWidth = 'max-w-3xl 3xl:max-w-5xl',
}: WizardShellProps) {
  const totalSteps = steps.length
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  function handleBack() {
    if (!isFirstStep) onStepChange(currentStep - 1)
  }

  function handleContinue() {
    if (isLastStep && onFinish) {
      onFinish()
    } else if (!isLastStep) {
      onStepChange(currentStep + 1)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Optional hero */}
      {hero}

      {/* Step progress indicator */}
      <div className={`${maxWidth} mx-auto px-4 py-6`}>
        <div className="flex items-start">
          {steps.map((step, i) => {
            const stepNum = i + 1
            const isComplete = currentStep > stepNum
            const isCurrent = currentStep === stepNum

            return (
              <div key={stepNum} className="flex items-center flex-1 last:flex-none">
                {/* Circle + label */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isComplete
                        ? 'bg-brand-accent text-brand-bg'
                        : isCurrent
                          ? 'bg-brand-primary text-brand-accent border border-brand-accent/60'
                          : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {isComplete ? '✓' : isCurrent && step.icon ? step.icon : stepNum}
                  </div>
                  <span
                    className={`text-xs whitespace-nowrap transition-colors duration-300 ${
                      currentStep >= stepNum ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {stepNum < totalSteps && (
                  <div
                    className={`flex-1 h-0.5 mx-3 mt-4 -translate-y-1/2 transition-all duration-300 ${
                      isComplete ? 'bg-brand-accent' : 'bg-gray-800'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Percentage bar (secondary indicator) */}
        <div className="mt-4">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500"
              style={{ width: `${Math.round((currentStep / totalSteps) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className={`${maxWidth} mx-auto px-4 pb-32`}>
        <div className="animate-[fadeIn_0.3s_ease]">{children}</div>
      </div>

      {/* Navigation footer */}
      {!hideNav && (
        <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-brand-accent/10 z-40">
          <div className={`${maxWidth} mx-auto px-4 py-4 flex items-center gap-3`}>
            {/* Back button */}
            {!isFirstStep ? (
              <button
                onClick={handleBack}
                className="btn-ghost btn-sm"
                aria-label="Go to previous step"
              >
                ← Back
              </button>
            ) : (
              <div /> /* spacer */
            )}

            {/* Step counter */}
            <span className="text-xs text-gray-500 flex-1 text-center">
              Step {currentStep} of {totalSteps}
            </span>

            {/* Continue / Finish button */}
            <button
              onClick={handleContinue}
              disabled={!canContinue || submitting}
              className={`btn-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-150 ${
                canContinue && !submitting ? 'btn-primary' : 'btn-disabled'
              }`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              ) : isLastStep ? (
                finishLabel
              ) : (
                'Continue →'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Utility: Progress bar (standalone, for pages that want just the bar) ─────

export function WizardProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>
          Step {step} of {total}
        </span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
