interface HeroSectionProps {
  title: string
  highlight?: string
  description: string
}

export default function HeroSection({ title, highlight, description }: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-brand-text sm:text-5xl">
        {title}
        {highlight && (
          <>
            {' '}
            <span className="text-brand-accent">{highlight}</span>
          </>
        )}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-text-muted">
        {description}
      </p>
    </section>
  )
}
