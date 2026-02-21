import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { db } from '#/db/index'
import { inquiries, tours } from '#/db/schema'

const getTours = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select({ id: tours.id, name: tours.name }).from(tours)
})

const submitInquiry = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { name: string; email: string; tourId?: number; message: string }) => data,
  )
  .handler(async ({ data }) => {
    await db.insert(inquiries).values({
      name: data.name,
      email: data.email,
      tourId: data.tourId ?? null,
      message: data.message,
    })
    return { success: true }
  })

export const Route = createFileRoute('/contact')({
  component: Contact,
  validateSearch: (search: Record<string, unknown>) => ({
    tourId: search.tourId ? Number(search.tourId) : undefined,
  }),
  loader: async () => await getTours(),
})

function Contact() {
  const allTours = Route.useLoaderData()
  const { tourId: preselectedTourId } = Route.useSearch()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [tourId, setTourId] = useState<string>(
    preselectedTourId ? String(preselectedTourId) : '',
  )
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await submitInquiry({
      data: {
        name,
        email,
        tourId: tourId ? Number(tourId) : undefined,
        message,
      },
    })
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-4xl font-semibold mb-4">Message received.</h2>
          <p className="font-sans font-light text-taupe text-lg leading-relaxed">
            Thank you, {name}. We'll be in touch within 48 hours. We read every message personally.
          </p>
        </div>
      </div>
    )
  }

  const inputClass =
    'w-full border border-mist bg-transparent font-sans font-light text-dark placeholder-taupe/50 px-4 py-3 text-sm focus:outline-none focus:border-dark transition-colors'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-mist py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-rust font-sans text-xs tracking-[0.3em] uppercase mb-4">
            Get in Touch
          </p>
          <h1 className="font-display text-6xl font-semibold mb-6">Let's plan something.</h1>
          <p className="text-taupe font-light text-xl max-w-2xl leading-relaxed">
            Tell us about your dream trip. We'll come back with ideas, not a sales pitch. All enquiries are answered personally within 48 hours.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-16">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-sans text-xs tracking-[0.15em] uppercase text-taupe mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-sans text-xs tracking-[0.15em] uppercase text-taupe mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs tracking-[0.15em] uppercase text-taupe mb-2">
              Safari of Interest{' '}
              <span className="normal-case tracking-normal text-taupe/50">(optional)</span>
            </label>
            <select
              value={tourId}
              onChange={(e) => setTourId(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Not sure yet</option>
              {allTours.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-sans text-xs tracking-[0.15em] uppercase text-taupe mb-2">
              Your Message
            </label>
            <textarea
              required
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your ideal trip — when, where, who you're travelling with, anything else on your mind..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-dark text-cream font-sans font-medium text-sm tracking-wide px-10 py-4 hover:bg-rust transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Enquiry'}
          </button>
        </form>

        {/* Contact info */}
        <div className="space-y-10">
          <div>
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-rust mb-3">
              Email
            </p>
            <p className="font-sans font-light text-taupe">hello@kalahariand.co</p>
          </div>
          <div>
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-rust mb-3">
              Phone
            </p>
            <p className="font-sans font-light text-taupe">+254 20 123 4567</p>
            <p className="font-sans text-xs text-taupe/60 mt-1">Nairobi office (EAT, GMT+3)</p>
          </div>
          <div>
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-rust mb-3">
              Response Time
            </p>
            <p className="font-sans font-light text-taupe">
              We respond to all enquiries within 48 hours. For urgent requests, please call.
            </p>
          </div>
          <div className="border-t border-mist pt-8">
            <p className="font-display text-xl italic text-taupe leading-snug">
              "Every great safari starts with a single conversation."
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
