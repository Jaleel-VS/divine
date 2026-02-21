import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  const values = [
    {
      title: 'Wild First',
      body: 'We design every itinerary to minimise footprint and maximise authenticity. No overcrowded lodges. No tourist conveyor belts. Just you and the wilderness.',
    },
    {
      title: 'Community Rooted',
      body: 'A significant portion of every safari fee goes directly to the local communities whose land we travel through. Conservation only works when people benefit from it.',
    },
    {
      title: 'Expert Led',
      body: 'Every guide we work with has spent at least a decade in the field. They are naturalists, trackers, and storytellers — people who make the bush legible.',
    },
  ]

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
              Built from a love of wild places.
            </h1>
          </div>
          <p className="text-taupe font-light text-xl leading-relaxed">
            Kalahari & Co. was founded in 2008 by James and Amara Odhiambo, who met on a research expedition in the Maasai Mara. What began as a shared obsession became a vocation — and eventually, a company.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <img
            src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=900&q=80"
            alt="Safari guide in the field"
            className="w-full aspect-[3/4] object-cover"
          />
        </div>
        <div className="pt-4">
          <h2 className="font-display text-4xl font-semibold mb-6">
            Sixteen years, thousands of safaris, one standard.
          </h2>
          <div className="space-y-5 text-taupe font-light text-lg leading-relaxed">
            <p>
              We started with a single Land Cruiser, two guides, and a deep conviction that the safari industry was selling something it wasn't delivering: genuine wilderness encounters, tailored to individual travellers, led by people who genuinely knew the land.
            </p>
            <p>
              Today, we operate across six African countries and work with a carefully curated network of owner-run camps and lodges that share our values. Our team includes field biologists, former park rangers, and cultural historians.
            </p>
            <p>
              We've stayed deliberately small. The day we can no longer personally vouch for every experience we sell is the day we stop operating.
            </p>
          </div>
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
                <h3 className="font-display text-cream text-3xl font-semibold mb-4">
                  {v.title}
                </h3>
                <p className="font-sans text-cream/60 font-light leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 px-6 border-b border-mist">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-display text-4xl font-medium italic leading-snug mb-8">
            "The Serengeti at dawn, with James explaining what the lion's posture meant — I've never felt so completely present in my life."
          </blockquote>
          <p className="font-sans text-sm tracking-widest text-taupe uppercase">
            — Catherine R., London · Serengeti Migration, 2023
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-4xl font-semibold mb-2">
              Ready to plan your safari?
            </h2>
            <p className="text-taupe font-light">
              Start with a conversation. No pressure, no pitch — just an honest discussion about your trip.
            </p>
          </div>
          <Link
            to="/contact"
            className="flex-shrink-0 bg-dark text-cream font-sans font-medium text-sm tracking-wide px-10 py-4 hover:bg-rust transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}
