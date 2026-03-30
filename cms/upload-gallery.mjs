// Uploads local images to Strapi gallery field for a specific tour.
// Usage: STRAPI_ADMIN_EMAIL=x STRAPI_ADMIN_PASSWORD=y node upload-gallery.mjs

import { readFile } from 'node:fs/promises'
import { basename, extname } from 'node:path'
import { lookup } from 'node:dns/promises'

const STRAPI = process.env.STRAPI_URL || 'http://localhost:1337'
const EMAIL = process.env.STRAPI_ADMIN_EMAIL
const PASSWORD = process.env.STRAPI_ADMIN_PASSWORD
const TOUR_SLUG = process.env.TOUR_SLUG || 'namib-desert'

const IMAGES = [
  '/Users/jdvans/Downloads/Dunes 2.jpg',
  '/Users/jdvans/Downloads/dunes at deadvlei.jpg',
  '/Users/jdvans/Downloads/Dunes meet ocean.jpg',
  '/Users/jdvans/Downloads/dunes.jpg',
  '/Users/jdvans/Downloads/Open picture.jpg',
  '/Users/jdvans/Downloads/Skeleton_Coast_(23910020708).jpg',
  '/Users/jdvans/Downloads/Oryx in the dunes.jpg',
]

if (!EMAIL || !PASSWORD) {
  console.error('Set STRAPI_ADMIN_EMAIL and STRAPI_ADMIN_PASSWORD')
  process.exit(1)
}

const jwt = await fetch(`${STRAPI}/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
}).then(r => r.json()).then(r => r.data.token)

// Find the tour
const tours = await fetch(`${STRAPI}/content-manager/collection-types/api::tour.tour`, {
  headers: { Authorization: `Bearer ${jwt}` },
}).then(r => r.json()).then(r => r.results)

const tour = tours.find(t => t.slug === TOUR_SLUG)
if (!tour) { console.error(`Tour "${TOUR_SLUG}" not found`); process.exit(1) }
console.log(`Found tour: ${tour.name} (${tour.documentId})\n`)

const uploadedIds = []

for (const filePath of IMAGES) {
  const buffer = await readFile(filePath).catch(() => null)
  if (!buffer) { console.log(`⏭ Skipping (not found): ${filePath}`); continue }

  const name = basename(filePath)
  const mime = extname(filePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg'

  // Resize to max 1600px wide using sips (macOS built-in)
  const tmpPath = `/tmp/gallery-${Date.now()}-${name.replace(/\s/g, '_')}`
  const { execSync } = await import('node:child_process')
  execSync(`sips -Z 1600 "${filePath}" --out "${tmpPath}" 2>/dev/null`)
  const resized = await readFile(tmpPath)

  console.log(`⬆ Uploading ${name}...`)
  const form = new FormData()
  form.append('files', new Blob([resized], { type: mime }), name)

  const res = await fetch(`${STRAPI}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  })

  if (!res.ok) { console.error(`✗ Failed: ${await res.text()}`); continue }
  const [uploaded] = await res.json()
  uploadedIds.push(uploaded.id)
  console.log(`✓ ${name} (id: ${uploaded.id})`)
}

// Link all uploaded images to the tour's gallery field
console.log(`\nLinking ${uploadedIds.length} images to gallery...`)
const existing = tour.gallery?.map(g => g.id) ?? []
const allIds = [...new Set([...existing, ...uploadedIds])]

const update = await fetch(
  `${STRAPI}/content-manager/collection-types/api::tour.tour/${tour.documentId}`,
  {
    method: 'PUT',
    headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ gallery: allIds }),
  }
)

if (!update.ok) { console.error('✗ Link failed:', await update.text()); process.exit(1) }

await fetch(
  `${STRAPI}/content-manager/collection-types/api::tour.tour/${tour.documentId}/actions/publish`,
  { method: 'POST', headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' }, body: '{}' }
)

console.log(`✓ Gallery updated and tour published`)
