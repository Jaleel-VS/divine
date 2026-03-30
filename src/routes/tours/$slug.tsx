import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { fetchTourBySlug } from '#/lib/strapi'

export const Route = createFileRoute('/tours/$slug')({
  component: TourDetail,
  loader: async ({ params }) => {
    const tour = await fetchTourBySlug(params.slug)
    if (!tour) throw notFound()
    return tour
  },
})

function TourDetail() {
  const tour = Route.useLoaderData()

  return (
    <div className="min-h-screen">
      {/* Hero image */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={tour.image?.url ?? ""}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/30" />
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-12 max-w-6xl mx-auto">
          <p className="text-cream/70 font-sans text-xs tracking-[0.25em] uppercase mb-3">
            {tour.location}
          </p>
          <h1 className="font-display text-cream text-6xl font-semibold leading-none">
            {tour.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main content */}
          <div className="lg:col-span-2">
            <p className="font-display text-2xl italic text-taupe mb-8">
              "{tour.tagline}"
            </p>
            <p className="font-sans text-lg font-light leading-relaxed text-taupe mb-12">
              {tour.description}
            </p>

            <div>
              <h2 className="font-display text-3xl font-semibold mb-6">Tour Highlights</h2>
              <ul className="space-y-3">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rust" />
                    <span className="font-sans font-light text-taupe leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-mist p-8 sticky top-24">
              <p className="font-display text-4xl font-semibold mb-1">
                ${tour.price.toLocaleString()}
              </p>
              <p className="font-sans text-xs tracking-wide text-taupe mb-8">per person</p>

              <div className="space-y-4 mb-8 pb-8 border-b border-mist">
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-taupe">Duration</span>
                  <span className="font-sans text-sm font-medium">{tour.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-taupe">Location</span>
                  <span className="font-sans text-sm font-medium">{tour.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-taupe">Group size</span>
                  <span className="font-sans text-sm font-medium">Max {tour.maxGuests} guests</span>
                </div>
              </div>

              <Link
                to="/contact"
                search={{ tour: tour.documentId }}
                className="block w-full bg-dark text-cream font-sans font-medium text-sm tracking-wide text-center py-4 hover:bg-rust transition-colors mb-4"
              >
                Inquire About This Safari
              </Link>
              <Link
                to="/tours"
                className="block w-full border border-mist text-taupe font-sans text-sm tracking-wide text-center py-3 hover:border-dark hover:text-dark transition-colors"
              >
                ← Back to all tours
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
