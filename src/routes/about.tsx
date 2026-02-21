import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  const values = [
    {
      title: 'Namibia First',
      body: 'We operate exclusively in Namibia. That focus means depth, not breadth — guides who know every waterhole in Etosha, every dune shadow in Sossusvlei, every desert-adapted species in Damaraland.',
    },
    {
      title: 'Community Rooted',
      body: 'Our team is Namibian. A meaningful portion of every booking goes directly to local communities and conservation initiatives in the areas we operate. Tourism that benefits the land and the people on it.',
    },
    {
      title: 'Small by Design',
      body: 'We cap every safari at ten guests. Smaller groups mean better sightings, more flexibility, and guides who can give you their full attention. We will never sacrifice quality for volume.',
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
              Born from a love of the Namib.
            </h1>
          </div>
          <p className="text-taupe font-light text-xl leading-relaxed">
            Divine Tours & Safari was founded in 2010 by Thomas and Ester Nghifikepunye, two Namibians who believed their country deserved a safari company as serious about it as they were.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <img
            src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=900&q=80"
            alt="Safari guide in Namibia"
            className="w-full aspect-[3/4] object-cover"
          />
        </div>
        <div className="pt-4">
          <h2 className="font-display text-4xl font-semibold mb-6">
            Fifteen years. One country. No compromises.
          </h2>
          <div className="space-y-5 text-taupe font-light text-lg leading-relaxed">
            <p>
              We started with two Land Cruisers and a conviction that Namibia was being undersold. Most operators treated it as a stop on a broader African circuit. We saw something different — a country so singular, so extreme in its beauty, that it deserved your full attention.
            </p>
            <p>
              Today we run safaris across Namibia's most spectacular landscapes: the red dunes of Sossusvlei, the salt pans of Etosha, the wild shores of the Skeleton Coast, the ancient rock art of Damaraland, and the dramatic silence of the Fish River Canyon.
            </p>
            <p>
              Our guides are not tour operators who memorised facts. They are trackers, naturalists, and storytellers who were raised in this landscape. That is an advantage no itinerary can manufacture.
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
            "Standing on top of Big Daddy at sunrise with Thomas pointing out oryx tracks in the valley below — that's not something you find on a package tour."
          </blockquote>
          <p className="font-sans text-sm tracking-widest text-taupe uppercase">
            — Mark T., Amsterdam · Sossusvlei & Skeleton Coast, 2024
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-4xl font-semibold mb-2">
              Ready to see Namibia properly?
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
