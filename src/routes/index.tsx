import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '#/db/index'
import { tours } from '#/db/schema'

const getFeaturedTours = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select().from(tours).limit(3).all()
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getFeaturedTours(),
})

function Home() {
  const featured = Route.useLoaderData()

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[92vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80"
          alt="African elephants in the wild"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/40" />
        <div className="relative h-full flex flex-col justify-end pb-20 px-8 max-w-6xl mx-auto">
          <p className="text-cream/70 font-sans text-sm tracking-[0.25em] uppercase mb-4">
            Est. 2008 · Nairobi, Kenya
          </p>
          <h1 className="font-display text-cream text-7xl md:text-8xl font-semibold leading-none mb-6 max-w-3xl">
            Where the Wild<br />Still Calls.
          </h1>
          <p className="font-sans text-cream/80 text-lg font-light max-w-xl mb-10 leading-relaxed">
            We design bespoke African safaris for travellers who want the real thing — raw wilderness, expert guides, and no shortcuts.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/tours"
              className="bg-rust text-cream font-sans font-medium text-sm tracking-wide px-8 py-3.5 hover:bg-rust/90 transition-colors"
            >
              View Our Tours
            </Link>
            <Link
              to="/contact"
              className="border border-cream/50 text-cream font-sans font-medium text-sm tracking-wide px-8 py-3.5 hover:bg-cream/10 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-rust font-sans text-xs tracking-[0.3em] uppercase mb-4">
              About Kalahari & Co.
            </p>
            <h2 className="font-display text-5xl font-semibold leading-tight mb-6">
              Sixteen years of guiding the extraordinary.
            </h2>
          </div>
          <div>
            <p className="text-taupe font-light text-lg leading-relaxed mb-4">
              We are a small, family-run operation based in Nairobi. We don't believe in cookie-cutter itineraries or overcrowded lodges. Every safari we design is built around the traveller — your pace, your interests, your version of Africa.
            </p>
            <p className="text-taupe font-light text-lg leading-relaxed">
              Our guides have decades of collective experience and deep relationships with the landscapes they work in. They know where the leopard naps after a kill. They know which river crossing will happen on which morning. That knowledge is your advantage.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="bg-dark py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-rust font-sans text-xs tracking-[0.3em] uppercase mb-3">
                Curated Itineraries
              </p>
              <h2 className="font-display text-cream text-5xl font-semibold">
                Featured Safaris
              </h2>
            </div>
            <Link
              to="/tours"
              className="text-cream/60 font-sans text-sm tracking-wide hover:text-cream transition-colors border-b border-cream/20 pb-0.5"
            >
              View all tours →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((tour) => (
              <TourCard key={tour.id} tour={tour} dark />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="border-y border-mist py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-rust font-sans text-xs tracking-[0.3em] uppercase mb-4">Ready to Go?</p>
          <h2 className="font-display text-5xl font-semibold mb-4">
            Tell us your dream. We'll plan the rest.
          </h2>
          <p className="text-taupe font-light text-lg mb-10 max-w-lg mx-auto">
            No hard sell. Just a conversation about what matters to you — and the best way to make it happen.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-dark text-cream font-sans font-medium text-sm tracking-wide px-10 py-4 hover:bg-rust transition-colors"
          >
            Start Planning
          </Link>
        </div>
      </section>
    </div>
  )
}

type Tour = {
  id: number
  name: string
  tagline: string
  location: string
  duration: number
  price: number
  imageUrl: string
}

function TourCard({ tour, dark }: { tour: Tour; dark?: boolean }) {
  return (
    <Link
      to="/tours/$tourId"
      params={{ tourId: String(tour.id) }}
      className="group block"
    >
      <div className="overflow-hidden aspect-[4/3] mb-4">
        <img
          src={tour.imageUrl}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <p className={`font-sans text-xs tracking-[0.2em] uppercase mb-1.5 ${dark ? 'text-rust' : 'text-taupe'}`}>
        {tour.location} · {tour.duration} days
      </p>
      <h3 className={`font-display text-2xl font-semibold mb-1 group-hover:text-rust transition-colors ${dark ? 'text-cream' : 'text-dark'}`}>
        {tour.name}
      </h3>
      <p className={`font-sans text-sm font-light italic ${dark ? 'text-cream/60' : 'text-taupe'}`}>
        {tour.tagline}
      </p>
      <p className={`font-sans text-sm font-medium mt-3 ${dark ? 'text-cream/50' : 'text-taupe'}`}>
        From ${tour.price.toLocaleString()} pp
      </p>
    </Link>
  )
}
