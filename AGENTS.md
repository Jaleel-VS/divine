# AGENTS.md — Divine Tours & Safaris

Project-specific conventions for AI agents. Read this before touching anything.

## Stack

- **Frontend**: TanStack Start (RC) + TanStack Router, React 19, Tailwind v4, Vite 7
- **CMS**: Strapi 5 in `cms/` — the ONLY data source. No direct DB access from the frontend.
- **Package managers**: `pnpm` for the frontend, `npm` for `cms/`
- **Node**: 22 (managed via mise — see `cms/mise.toml`)
- **Deployment**: Railway — frontend service + Strapi service + Postgres DB in one project
- **Images**: Cloudinary via `@strapi/provider-upload-cloudinary`

## Critical Rules

### Never touch the database directly
The frontend has NO database connection. All data comes from Strapi's REST API via `src/lib/strapi.ts`. Do not add drizzle, pg, or any DB client to the frontend.

### All Strapi fetches must use `createServerFn`
Every function in `src/lib/strapi.ts` is wrapped in `createServerFn()`. This ensures they run server-side only — the internal Railway URL (`http://charismatic-cat.railway.internal:8080`) is not reachable from the browser. Never call Strapi directly from a component or client-side code.

### Test locally before pushing to prod
- Frontend: `pnpm dev` (port 3000)
- Strapi: `cd cms && npm run develop` (port 1337)
- Local Strapi uses SQLite; prod uses Postgres on Railway
- Seed scripts in `cms/` can be run against local or prod via `STRAPI_URL` env var

### TanStack Start conventions
See `.kiro/steering/tanstack-start.md` for the full reference. Key points:
- Use `createFileRoute('/path')` — never `createRoute()`
- Use `createServerFn()` from `@tanstack/react-start` — never `'use server'`
- Loaders return data directly — no `json()` wrapper
- Use `Route.useLoaderData()` — not standalone `useLoaderData()`

## Project Structure

```
/
├── src/
│   ├── lib/strapi.ts        # All Strapi API calls (server functions only)
│   ├── routes/
│   │   ├── index.tsx        # Homepage — fetchFeaturedTours
│   │   ├── tours/index.tsx  # Tours listing — fetchTours
│   │   ├── tours/$slug.tsx  # Tour detail — fetchTourBySlug (slug, not ID)
│   │   ├── contact.tsx      # Contact form — fetchTourNames + submitInquiry
│   │   └── about.tsx        # About page — fetchAboutPage (falls back to hardcoded)
│   └── components/
│       └── Header.tsx
├── cms/                     # Strapi 5 instance
│   ├── src/api/
│   │   ├── tour/            # Tour collection type
│   │   ├── inquiry/         # Inquiry collection type
│   │   └── about-page/      # About Page single type
│   ├── src/components/
│   │   ├── tour/            # itinerary-day component
│   │   └── about/           # value-item component
│   ├── seed-tours.mjs       # Seed tours via admin API
│   ├── upload-images.mjs    # Upload hero images to Strapi/Cloudinary
│   └── upload-gallery.mjs   # Upload gallery images for a tour
└── .kiro/steering/
    └── tanstack-start.md    # TanStack Start reference (do not delete)
```

## Strapi Content Types

### Tour (collection)
Fields: `name`, `slug` (uid), `tagline`, `description`, `location`, `duration`, `price`, `maxGuests`, `highlights` (json), `featured` (bool), `image` (media), `gallery` (media, multiple), `itinerary` (repeatable component: day, title, description)

### Inquiry (collection)
Fields: `name`, `email`, `message`, `tour` (relation to Tour)

### About Page (single type)
Fields: `tagline`, `intro`, `story` (blocks), `quote`, `quoteAuthor`, `values` (repeatable component: title, body)

## Strapi Public API Permissions
These must be set in Strapi admin → Settings → Users & Permissions → Roles → Public:
- Tour: `find`, `findOne`
- Inquiry: `create`
- About-page: `find`

## Environment Variables

### Frontend (`.env`)
```
STRAPI_URL=http://localhost:1337          # local
# STRAPI_URL=http://charismatic-cat.railway.internal:8080  # prod (set in Railway)
CLOUDINARY_NAME=dzyrccegs
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Strapi (`cms/.env`)
```
DATABASE_CLIENT=sqlite                   # local
# DATABASE_CLIENT=postgres               # prod
DATABASE_URL=...                         # prod only
DATABASE_SSL=true                        # prod only
DATABASE_SSL_REJECT_UNAUTHORIZED=false   # prod only (Railway self-signed cert)
CLOUDINARY_NAME=dzyrccegs
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
```

## Deployment Checklist (Railway)
After schema changes (new fields/content types):
1. Push to git → Railway redeploys both services automatically
2. If new content type added: set public permissions in Strapi admin
3. If new data needed: run seed/upload scripts with `STRAPI_URL=https://...railway.app`
4. Re-publish affected tours if images/itinerary were updated (draft vs published)

## Known Gotchas
- **Draft vs Published**: Strapi 5 has draft/publish. After updating content via API, always re-publish. The public API only returns published content.
- **Gallery images**: After uploading via `upload-gallery.mjs`, the tour must be re-published for gallery to appear in the public API.
- **Image URLs**: Local Strapi returns relative `/uploads/...` paths. `resolveImageUrl()` in `strapi.ts` handles this. Cloudinary returns absolute URLs.
- **Strapi schema changes**: Changing `cms/src/api/*/content-types/*/schema.json` requires a Strapi restart to take effect. On Railway this happens automatically on deploy.
- **`pnpm dlx`** is the equivalent of `npx` for the frontend. Use `npm` inside `cms/`.
