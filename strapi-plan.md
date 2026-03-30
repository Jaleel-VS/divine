# Strapi CMS Integration Plan — Divine Tours & Safari

## Overview

Replace the current Drizzle/Postgres data layer with Strapi as the content source.
Strapi runs as a separate service (Railway), exposes a REST API, and gives the site
owner a no-code admin UI to manage tours and view inquiries.

---

## 1. Strapi Setup (Railway)

- Create a new Railway service from the Strapi template (or deploy manually)
- Attach a Postgres database to the Strapi service (Railway add-on)
- Set `STRAPI_URL` and `STRAPI_API_TOKEN` as environment variables in the frontend service
- Configure Strapi media uploads to use Cloudinary or an S3 bucket (avoid storing images on the Railway filesystem — it's ephemeral)

---

## 2. Content Types in Strapi

### Tour (Collection Type)

| Field        | Type              | Notes                                      |
|--------------|-------------------|--------------------------------------------|
| name         | Short text        |                                            |
| slug         | UID (from name)   | Used in URLs: `/tours/sossusvlei-dune-safari` |
| tagline      | Short text        |                                            |
| description  | Long text         |                                            |
| location     | Short text        |                                            |
| duration     | Integer           | Days                                       |
| price        | Integer           | Per person, USD                            |
| maxGuests    | Integer           |                                            |
| image        | Media (single)    | Replaces Unsplash URLs                     |
| highlights   | JSON / Component  | Array of strings                           |
| featured     | Boolean           | Controls homepage featured section         |

### Inquiry (Collection Type)

| Field    | Type        | Notes                          |
|----------|-------------|--------------------------------|
| name     | Short text  |                                |
| email    | Email       |                                |
| tour     | Relation    | Many-to-one → Tour (optional)  |
| message  | Long text   |                                |

> Inquiries are submitted by site visitors and read-only in the admin for the owner.
> Set the Inquiry content type to have create permissions for public (unauthenticated) API role,
> and read-only for the Editor role.

---

## 3. Strapi Roles & Permissions

| Role    | Tours          | Inquiries         |
|---------|----------------|-------------------|
| Public  | find, findOne  | create            |
| Editor  | full CRUD      | find, findOne     |
| Admin   | everything     | everything        |

Create an "Editor" role for the site owner. He can manage tours and view inquiries
but cannot touch API tokens, roles, or settings.

---

## 4. Frontend Changes

### Environment variables

```
STRAPI_URL=https://your-strapi.railway.app
STRAPI_API_TOKEN=your_readonly_token
```

### Replace server functions

Current pattern:
```ts
// src/db/...
const getTours = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select().from(tours)
})
```

New pattern:
```ts
// src/lib/strapi.ts
const STRAPI = process.env.STRAPI_URL
const TOKEN = process.env.STRAPI_API_TOKEN

export async function fetchTours() {
  const res = await fetch(`${STRAPI}/api/tours?populate=image&sort=createdAt:asc`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  const { data } = await res.json()
  return data
}

export async function fetchTour(slug: string) {
  const res = await fetch(`${STRAPI}/api/tours?filters[slug][$eq]=${slug}&populate=image`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  const { data } = await res.json()
  return data[0] ?? null
}

export async function submitInquiry(payload: InquiryPayload) {
  await fetch(`${STRAPI}/api/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ data: payload }),
  })
}
```

### Route changes

- `/tours` — calls `fetchTours()`, maps Strapi response shape to component props
- `/tours/$tourId` → `/tours/$slug` — switch param from numeric ID to slug (better URLs, better SEO)
- `/contact` — calls `submitInquiry()` instead of inserting via Drizzle
- `/` (homepage) — calls `fetchTours()` with a `filters[featured][$eq]=true` filter

### Image handling

Strapi returns image URLs relative to the Strapi host:
```ts
const imageUrl = `${process.env.STRAPI_URL}${tour.image.url}`
// or if using Cloudinary provider, it returns the full CDN URL directly
```

---

## 5. URL Migration (IDs → Slugs)

Current: `/tours/3`
New: `/tours/sossusvlei-dune-safari`

Update the dynamic route file from `$tourId.tsx` to `$slug.tsx` and update all
`<Link to="/tours/$tourId">` references to use `params={{ slug: tour.slug }}`.

This is the most impactful SEO change in the whole migration.

---

## 6. Retire Drizzle

Once Strapi is live and data is migrated:

- Delete `src/db/` directory
- Remove `drizzle-orm`, `drizzle-kit`, `pg`, `@types/pg` from `package.json`
- Delete `drizzle.config.ts` and `drizzle/` directory
- Remove `db:*` scripts from `package.json`

---

## 7. Data Migration

1. Export current tour data from Postgres (`db:studio` or a one-off script)
2. Re-enter tours in Strapi admin (there are only a handful — manual is fine)
3. Upload real tour images via Strapi media library
4. Verify slugs are clean and URL-safe before going live

---

## 8. Deployment Order

1. Deploy Strapi to Railway, attach Postgres, configure media provider
2. Enter all tour content in Strapi admin
3. Set permissions (public: read tours, create inquiries)
4. Update frontend env vars, swap data layer, test locally
5. Deploy frontend
6. Verify all routes, form submission, and image loading in production

---

## 9. Nice-to-Haves (Post-Launch)

- **Webhooks** — Strapi can ping a revalidation endpoint when content changes, triggering a cache purge or rebuild
- **Draft/Publish** — Strapi supports draft mode; useful for preparing new tours before they go live
- **Email on inquiry** — add a Strapi lifecycle hook or plugin to send an email notification when a new inquiry is submitted
- **Strapi Cloud** — if Railway becomes a hassle, Strapi Cloud is a managed alternative with a free tier
