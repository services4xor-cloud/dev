'use client'

interface WizardStep {
  key: string
  title: string
}

interface WizardShellProps {
  steps: WizardStep[]
  currentStep: number
  onNext: () => void
  onBack: () => void
  nextLabel?: string
  nextDisabled?: boolean
  children: React.ReactNode
}

export default function WizardShell({
  steps,
  currentStep,
  onNext,
  onBack,
  nextLabel,
  nextDisabled = false,
  children,
}: WizardShellProps) {
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-brand-surface p-8">
        {/* Step indicator */}
        <div className="text-center">
          <p className="text-xs text-brand-text-muted">
            Step {currentStep + 1} of {steps.length}
          </p>
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            {steps.map((step, i) => {
              const isDone = i < currentStep
              const isActive = i === currentStep
              return (
                <div key={step.key} className="flex items-center gap-2">
                  <div
                    className={[
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-accent text-brand-bg'
                        : isDone
                          ? 'bg-brand-accent/30 text-brand-accent'
                          : 'bg-brand-surface text-brand-text-muted border border-brand-accent/20',
                    ].join(' ')}
                  >
                    {isDone ? '✓' : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={[
                        'h-px w-6',
                        isDone ? 'bg-brand-accent/50' : 'bg-brand-accent/15',
                      ].join(' ')}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <h2 className="mt-4 text-xl font-bold text-brand-accent">{steps[currentStep]?.title}</h2>
        </div>

        {/* Step content */}
        {children}

        {/* Navigation */}
        <div className="flex gap-3">
          {!isFirst && (
            <button
              onClick={onBack}
              className="rounded-lg border border-brand-accent/20 px-4 py-3 font-medium text-brand-text-muted transition hover:text-brand-text"
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="flex-1 rounded-lg bg-brand-primary px-4 py-3 font-medium text-brand-accent transition hover:opacity-90 disabled:opacity-50"
          >
            {nextLabel || (isLast ? 'Complete' : 'Next')}
          </button>
        </div>
      </div>
    </div>
  )
}

export type { WizardStep }
