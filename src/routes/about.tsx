import { Link, createFileRoute } from '@tanstack/react-router'
import { fetchAboutPage } from '#/lib/strapi'

export const Route = createFileRoute('/about')({
  component: About,
  loader: async () => {
    try { return await fetchAboutPage() } catch { return null }
  },
})

const FALLBACK = {
  tagline: 'Born from a love for nature.',
  intro: 'Divine Tours & Safari was founded in 2019 by Graham van Staden, a Namibian who believed his country deserved a safari company as serious about it as he was.',
  story: [
    'From humble beginnings by renting 4×4 tour vehicles and a conviction that Namibia was being undersold. Most operators treated it as a stop on a broader African circuit. We saw something different — a country so singular, so extreme in its beauty, that it deserved your full attention.',
    'Today we run safaris across Namibia\'s most spectacular landscapes: the red dunes of Sossusvlei, Southern Namibia, Coastal mega of Namibia, the salt pans of Etosha, the ancient rock art of Damaraland, and the dramatic silence of the Fish River Canyon.',
    'Our guides are not tour operators who memorised facts. They are trackers, naturalists, and storytellers who were raised in this landscape. That is an advantage no itinerary can manufacture.',
  ],
  quote: 'The world is a book, and those who do not travel read only a page.',
  quoteAuthor: 'St. Augustine',
  values: [
    { title: 'Namibia First', body: 'We operate solely in Namibia. This focus allows for depth rather than breadth — guides who are familiar with every waterhole in Etosha, every dune shadow in Sossusvlei, and every desert-adapted species in Damaraland.' },
    { title: 'Community Rooted', body: 'Our team is Namibian. A significant portion of every booking is directed towards supporting local communities and conservation initiatives within the areas we operate. We promote a form of tourism that benefits both the land and its people.' },
    { title: 'Small by Design', body: 'We limit every safari to eight guests per vehicle. Smaller groups result in better sightings, increased flexibility, and guides who can provide their full attention. We will never compromise quality for quantity.' },
  ],
}

function About() {
  const data = Route.useLoaderData()

  const tagline = data?.tagline ?? FALLBACK.tagline
  const intro = data?.intro ?? FALLBACK.intro
  const quote = data?.quote ?? FALLBACK.quote
  const quoteAuthor = data?.quoteAuthor ?? FALLBACK.quoteAuthor
  const values = data?.values?.length ? data.values : FALLBACK.values

  // story: Strapi blocks → plain text paragraphs, or fallback strings
  const storyParagraphs: string[] = data?.story?.length
    ? data.story.map((block) =>
        block.children.map((c) => c.text).join('')
      )
    : FALLBACK.story

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-mist py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-end">
          <div>
            <p className="text-rust font-sans text-xs tracking-[0.3em] uppercase mb-4">
              Our Story
            </p>
            <h1 className="font-display text-6xl font-semibold leading-tight">
              {tagline}
            </h1>
          </div>
          <p className="text-taupe font-light text-xl leading-relaxed">{intro}</p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="space-y-5 text-taupe font-light text-lg leading-relaxed max-w-3xl">
          {storyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 px-6 border-t border-b border-mist">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-display text-5xl font-medium italic leading-snug">
            "{quote}"
          </blockquote>
          <p className="font-sans text-sm tracking-widest text-taupe uppercase mt-6">
            — {quoteAuthor}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-dark py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-rust font-sans text-xs tracking-[0.3em] uppercase mb-4">
            What We Stand For
          </p>
          <h2 className="font-display text-cream text-5xl font-semibold mb-16">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {values.map((v) => (
              <div key={v.title}>
                <h3 className="font-display text-cream text-3xl font-semibold mb-4">{v.title}</h3>
                <p className="font-sans text-cream/60 font-light leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-4xl font-semibold mb-2">Ready to see Namibia properly?</h2>
            <p className="text-taupe font-light">Start with a conversation. No pressure, no pitch — just an honest discussion about your trip.</p>
          </div>
          <Link to="/contact" className="flex-shrink-0 bg-dark text-cream font-sans font-medium text-sm tracking-wide px-10 py-4 hover:bg-rust transition-colors">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}
