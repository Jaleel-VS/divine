import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { lazy, Suspense, useRef, useState, useEffect } from "react";
import { fetchTourBySlug } from "#/lib/strapi";

const ItineraryMap = lazy(() => import("#/components/ItineraryMap"));

export const Route = createFileRoute("/tours/$slug")({
  component: TourDetail,
  loader: async ({ params }) => {
    const tour = await fetchTourBySlug({ data: params.slug });
    if (!tour) throw notFound();
    return tour;
  },
});

function TourDetail() {
  const tour = Route.useLoaderData();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const itinerary = tour.itinerary?.length
    ? tour.itinerary
    : [
        {
          day: 1,
          title: "Windhoek → Namib Desert (285km)",
          description:
            "Afternoon Sesriem Canyon exploration and other activities.",
        },
        {
          day: 2,
          title: "Full-day Sossusvlei/Deadvlei clay pan adventure (55km)",
          description:
            "Climb Dune 45 at sunrise and explore the ancient Dead Vlei.",
        },
        {
          day: 3,
          title: "Return to Windhoek (375km)",
          description: "Final morning at leisure before the drive back.",
        },
      ];

  const slides = tour.gallery?.length
    ? tour.gallery.map((g) => g.url)
    : tour.image?.url
      ? [tour.image.url]
      : []

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  return (
    <div className="min-h-screen">
      {/* Hero carousel */}
      <div className="relative h-[60vh] overflow-hidden">
        {slides.map((url, i) => (
          <img
            key={url}
            src={url}
            alt={`${tour.name} ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-dark/30" />

        {/* Prev / Next buttons */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-dark/40 text-cream hover:bg-dark/70 transition-colors cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setCurrent((c) => (c + 1) % slides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-dark/40 text-cream hover:bg-dark/70 transition-colors cursor-pointer"
            >
              ›
            </button>
            {/* Dots */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${i === current ? 'bg-cream' : 'bg-cream/40'}`}
                />
              ))}
            </div>
          </>
        )}

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
      <div className="max-w-7xl mx-auto px-2 py-16">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main content */}
          <div className="lg:col-span-2">
            <p className="font-display text-2xl italic text-taupe mb-8">
              "{tour.tagline}"
            </p>
            <p className="font-sans text-lg font-light leading-relaxed text-taupe mb-12">
              {tour.description}
            </p>

            <div className="mb-12">
              <h2 className="font-display text-3xl font-semibold mb-6">
                Tour Highlights
              </h2>
              <ul className="space-y-3">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rust" />
                    <span className="font-sans font-light text-taupe leading-relaxed">
                      {h}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Itinerary preview */}
            <div>
              <h2 className="font-display text-3xl font-semibold mb-6">
                Itinerary
              </h2>
              <ol className="space-y-4">
                {itinerary.map((item) => (
                  <li key={item.day} className="flex gap-4">
                    <span className="font-sans text-xs tracking-[0.15em] uppercase text-rust pt-0.5 w-10 flex-shrink-0">
                      Day {item.day}
                    </span>
                    <div>
                      <p className="font-sans text-sm font-medium text-dark">
                        {item.title}
                      </p>
                      <p className="font-sans text-sm font-light text-taupe leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => { dialogRef.current?.showModal(); setMapOpen(true); }}
                className="mt-6 font-sans text-sm tracking-wide text-rust hover:text-dark transition-colors cursor-pointer"
              >
                View full itinerary →
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-mist p-8 sticky top-24">
              <p className="font-display text-4xl font-semibold mb-1">
                ${tour.price.toLocaleString('en-US')}
              </p>
              <p className="font-sans text-xs tracking-wide text-taupe mb-8">
                per person
              </p>

              <div className="space-y-4 mb-8 pb-8 border-b border-mist">
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-taupe">Duration</span>
                  <span className="font-sans text-sm font-medium">
                    {tour.duration} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-taupe">Location</span>
                  <span className="font-sans text-sm font-medium">
                    {tour.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-taupe">
                    Group size
                  </span>
                  <span className="font-sans text-sm font-medium">
                    Max {tour.maxGuests} guests
                  </span>
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

      {/* Itinerary modal */}
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            dialogRef.current.close()
            setMapOpen(false)
          }
        }}
        className="w-full max-w-5xl max-h-[85vh] overflow-hidden p-0 backdrop:bg-dark/50 open:flex flex-col m-auto"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-mist sticky top-0 bg-cream">
          <h2 className="font-display text-2xl font-semibold">
            {tour.name} — Itinerary
          </h2>
          <button
            type="button"
            onClick={() => { dialogRef.current?.close(); setMapOpen(false); }}
            className="font-sans text-taupe hover:text-dark transition-colors text-xl leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="md:w-1/2 h-64 md:h-auto bg-mist/30">
            {mapOpen && (
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-taupe text-sm">Loading map…</div>}>
                <ItineraryMap itinerary={itinerary} />
              </Suspense>
            )}
          </div>
          <div className="md:w-1/2 overflow-y-auto px-8 py-6 space-y-6">
            {itinerary.map((item) => (
              <div key={item.day} className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dark text-cream font-sans text-sm font-medium flex items-center justify-center">
                  {item.day}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="font-sans font-light text-taupe leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </div>
  );
}
