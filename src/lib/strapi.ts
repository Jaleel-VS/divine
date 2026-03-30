import { createServerFn } from '@tanstack/react-start'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

function headers(): HeadersInit {
  const h: HeadersInit = {}
  if (STRAPI_TOKEN) h['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  return h
}

async function fetchAPI<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    ...init,
    headers: { ...headers(), ...init?.headers },
  })
  if (!res.ok) throw new Error(`Strapi ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

// --- Types ---

export type StrapiTour = {
  id: number
  documentId: string
  name: string
  slug: string
  tagline: string
  description: string
  location: string
  duration: number
  price: number
  maxGuests: number
  highlights: string[]
  featured: boolean
  image?: { url: string } | null
  itinerary?: { day: number; title: string; description: string }[]
}

type StrapiList<T> = { data: T[]; meta: { pagination: { total: number } } }
type StrapiSingle<T> = { data: T }

function resolveImageUrl(tour: StrapiTour): StrapiTour {
  if (tour.image?.url && !tour.image.url.startsWith('http')) {
    tour.image.url = `${STRAPI_URL}${tour.image.url}`
  }
  return tour
}

// --- Tour queries ---

export const fetchTours = createServerFn().handler(async () => {
  const res = await fetchAPI<StrapiList<StrapiTour>>(
    '/api/tours?sort=createdAt:asc&populate=image',
  )
  return res.data.map(resolveImageUrl)
})

export const fetchFeaturedTours = createServerFn().handler(async () => {
  const res = await fetchAPI<StrapiList<StrapiTour>>(
    '/api/tours?filters[featured][$eq]=true&sort=createdAt:asc&populate=image',
  )
  return res.data.map(resolveImageUrl)
})

export const fetchTourBySlug = createServerFn()
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const res = await fetchAPI<StrapiList<StrapiTour>>(
      `/api/tours?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=image&populate=itinerary`,
    )
    const tour = res.data[0] ?? null
    return tour ? resolveImageUrl(tour) : null
  })

export const fetchTourNames = createServerFn().handler(async () => {
  const res = await fetchAPI<StrapiList<StrapiTour>>(
    '/api/tours?fields[0]=name&sort=createdAt:asc',
  )
  return res.data
})

// --- Inquiry mutation ---

export const submitInquiry = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: { name: string; email: string; tour?: string; message: string }) =>
      input,
  )
  .handler(async ({ data: payload }) => {
    const body: Record<string, unknown> = {
      name: payload.name,
      email: payload.email,
      message: payload.message,
    }
    if (payload.tour) body.tour = payload.tour

    return fetchAPI<StrapiSingle<{ documentId: string }>>('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: body }),
    })
  })
