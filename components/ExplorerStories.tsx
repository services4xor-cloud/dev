const stories = [
  {
    name: 'Amina K.',
    from: 'Nairobi, Kenya',
    to: 'Berlin, Germany',
    quote:
      'Be[X] connected me with Swahili-speaking tech communities in Berlin before I even landed. The corridor was already open — I just had to walk it.',
    dimension: 'Language',
  },
  {
    name: 'Felix M.',
    from: 'Mombasa, Kenya',
    to: 'Zurich, Switzerland',
    quote:
      'As an engineer, I found hosts who valued my skills and understood my culture. The matching went beyond just opportunity titles.',
    dimension: 'Craft',
  },
  {
    name: 'Sarah W.',
    from: 'Kisumu, Kenya',
    to: 'London, UK',
    quote:
      'The discovery wizard showed me corridors I never knew existed. My faith community in London welcomed me as family.',
    dimension: 'Faith',
  },
]

export default function ExplorerStories() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-center text-2xl font-semibold text-brand-text">What Explorers Say</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-brand-text-muted">
        Real stories from people who found their corridors
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <div
            key={story.name}
            className="rounded-lg border border-brand-accent/20 bg-brand-surface p-6"
          >
            <p className="text-sm italic leading-relaxed text-brand-text-muted">
              &ldquo;{story.quote}&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-brand-text">{story.name}</p>
                <p className="text-xs text-brand-text-muted">
                  {story.from} &rarr; {story.to}
                </p>
              </div>
              <span className="rounded-full border border-brand-accent/30 px-2 py-0.5 text-xs text-brand-accent">
                {story.dimension}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
