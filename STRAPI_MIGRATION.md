# Strapi Migration Progress

> **Status: COMPLETE** — Migration from Drizzle/Postgres to Strapi 5 CMS finished 2026-03-30.
> See `strapi-plan.md` for the original plan.

### Iteration 1: Strapi Instance + Content Types

- [x] Scaffold Strapi 5 into `cms/` directory (v5.40.0, SQLite quickstart)
- [x] Pin Node 22 for `cms/` via mise (`cms/mise.toml`)
- [x] Remove nested `.git` from `cms/`
- [x] Boot Strapi, create admin user at `http://localhost:1337/admin`
- [x] Create **Tour** content type (fields: name, slug, tagline, description, location, duration, price, maxGuests, image, highlights, featured)
- [x] Create **Inquiry** content type (fields: name, email, tour relation, message)
- [x] Restart Strapi to pick up new content types (`cd cms && npm run develop`)
- [x] Set permissions (Public: find/findOne tours, create inquiries)
- [x] Seed tour data into Strapi (6 tours, all published, with slugs)
- [x] Verified public API: `GET /api/tours` returns 6 tours, `POST /api/inquiries` works

### Iteration 2: Strapi API Client

- [x] Create `src/lib/strapi.ts` with typed fetch helpers (fetchTours, fetchFeaturedTours, fetchTourBySlug, fetchTourNames, submitInquiry)
- [x] Added `STRAPI_URL=http://localhost:1337` to `.env`
- [ ] Test helpers work against local Strapi (will be validated in iteration 3)

### Iteration 3: Swap Data Layer (route by route)

- [x] `/` (homepage) — uses `fetchFeaturedTours()` from Strapi
- [x] `/tours` — uses `fetchTours()` from Strapi
- [x] `/tours/$tourId` → `/tours/$slug` — renamed file, slug-based routing via `fetchTourBySlug()`
- [x] `/contact` — uses `fetchTourNames()` + `submitInquiry()` from Strapi, links via `documentId`
- [x] Build passes cleanly, all routes return 200 against local Strapi
- [x] Tour images uploaded to Strapi media library and linked (via `cms/upload-images.mjs`)
- [x] Image URLs resolved to absolute paths in `src/lib/strapi.ts` (handles relative `/uploads/...` paths)

### Iteration 4: Retire Drizzle

- [x] Delete `src/db/` directory
- [x] Remove drizzle-orm, drizzle-kit, pg, @types/pg, dotenv, tsx from package.json
- [x] Delete `drizzle.config.ts` and `drizzle/` directory
- [x] Remove `db:*` scripts from package.json
- [x] Remove `DATABASE_URL` from `.env`
- [x] `pnpm install` pruned 11 packages, build passes

### Iteration 5: Deploy

- [x] Install `@strapi/provider-upload-cloudinary` in `cms/`
- [x] Configure Cloudinary in `cms/config/plugins.ts`
- [x] Update `cms/config/middlewares.ts` to allow Cloudinary URLs
- [x] Generate Strapi secret keys (APP_KEYS, salts, JWT secrets)
- [ ] Create Cloudinary account, get cloud_name / key / secret
- [ ] Railway: add Postgres database to project
- [ ] Railway: add Strapi service (root dir: `cms`, build: `npm run build`, start: `npm run start`)
- [ ] Railway: set all env vars (DATABASE_CLIENT, DATABASE_URL, secrets, Cloudinary, NIXPACKS_NODE_VERSION=22)
- [ ] Railway: deploy Strapi, create admin account at `/admin`
- [ ] Railway: update frontend service env var `STRAPI_URL` to point at Strapi service
- [ ] Re-seed tours and upload images against production Strapi
- [ ] Create Editor role for site owner (uncle)
- [ ] Invite uncle to Strapi admin with Editor role
- [ ] Verify everything in production

## Notes

- Strapi is in `cms/` — requires Node ≤24 (pinned to 22 via mise)
- Main frontend project runs on Node 25 — no conflict since mise scopes it
- To start Strapi: `cd cms && npm run develop`
- Strapi admin: `http://localhost:1337/admin`
- Strapi uses npm (scaffolded default), frontend uses pnpm — that's fine, they're separate
