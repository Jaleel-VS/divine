import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '#/db/index'
import { tours } from '#/db/schema'

const getAllTours = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select().from(tours).all()
})

export const Route = createFileRoute('/tours/')({
  component: Tours,
  loader: async () => await getAllTours(),
})

function Tours() {
  const allTours = Route.useLoaderData()

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="border-b border-mist py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-rust font-sans text-xs tracking-[0.3em] uppercase mb-4">
            Our Itineraries
          </p>
          <h1 className="font-display text-6xl font-semibold mb-6">All Safaris</h1>
          <p className="text-taupe font-light text-xl max-w-2xl leading-relaxed">
            Six hand-crafted itineraries across the continent's most extraordinary wilderness areas. Each one is a starting point — we tailor everything to you.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {allTours.map((tour) => (
            <Link
              key={tour.id}
              to="/tours/$tourId"
              params={{ tourId: String(tour.id) }}
              className="group block"
            >
              <div className="overflow-hidden aspect-[4/3] mb-5">
                <img
                  src={tour.imageUrl}
                  alt={tour.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-taupe">
                  {tour.location}
                </p>
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-taupe">
                  {tour.duration} days
                </p>
              </div>
              <h2 className="font-display text-2xl font-semibold mb-1 group-hover:text-rust transition-colors">
                {tour.name}
              </h2>
              <p className="font-sans text-sm font-light italic text-taupe mb-3">
                {tour.tagline}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-mist">
                <p className="font-sans text-sm font-medium text-taupe">
                  From ${tour.price.toLocaleString()} pp
                </p>
                <span className="font-sans text-xs tracking-wide text-rust group-hover:underline">
                  View details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
