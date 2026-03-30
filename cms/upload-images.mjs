// Downloads Unsplash images and uploads them to Strapi media library, linking to each tour.
// Usage: STRAPI_ADMIN_EMAIL=x STRAPI_ADMIN_PASSWORD=y node upload-images.mjs

import { writeFile, unlink } from 'node:fs/promises'
import { basename } from 'node:path'

const STRAPI = process.env.STRAPI_URL || 'http://localhost:1337'
const EMAIL = process.env.STRAPI_ADMIN_EMAIL
const PASSWORD = process.env.STRAPI_ADMIN_PASSWORD

if (!EMAIL || !PASSWORD) {
  console.error('Set STRAPI_ADMIN_EMAIL and STRAPI_ADMIN_PASSWORD')
  process.exit(1)
}

const jwt = await fetch(`${STRAPI}/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
}).then(r => r.json()).then(r => r.data.token)

// Map tour slugs to their original Unsplash image URLs
const tourImages = {
  'namib-desert': 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80',
  'etosha-park': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
  'kunene-and-etosha-park': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',
  'southern-namibia-and-namib-desert': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
  'desert-coastal-etosha-park': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  'customised-namibian-experience': 'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=1200&q=80',
}

// Get all tours from admin API
const tours = await fetch(`${STRAPI}/content-manager/collection-types/api::tour.tour`, {
  headers: { Authorization: `Bearer ${jwt}` },
}).then(r => r.json()).then(r => r.results)

for (const tour of tours) {
  const url = tourImages[tour.slug]
  if (!url) { console.log(`⏭ ${tour.name} — no image URL mapped`); continue }

  console.log(`⬇ Downloading ${tour.slug}...`)
  const imgRes = await fetch(url)
  const buffer = Buffer.from(await imgRes.arrayBuffer())
  const tmpFile = `/tmp/${tour.slug}.jpg`
  await writeFile(tmpFile, buffer)

  console.log(`⬆ Uploading to Strapi...`)
  const form = new FormData()
  form.append('files', new Blob([buffer], { type: 'image/jpeg' }), `${tour.slug}.jpg`)

  // Step 1: Upload file via admin upload API
  const uploadRes = await fetch(`${STRAPI}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  })

  if (!uploadRes.ok) {
    console.error(`✗ ${tour.name} — upload failed: ${await uploadRes.text()}`)
    await unlink(tmpFile).catch(() => {})
    continue
  }

  const [uploaded] = await uploadRes.json()

  // Step 2: Link the uploaded file to the tour's image field
  const linkRes = await fetch(`${STRAPI}/content-manager/collection-types/api::tour.tour/${tour.documentId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: uploaded.id }),
  })

  if (linkRes.ok) {
    console.log(`✓ ${tour.name} — image uploaded and linked (id: ${uploaded.id})`)
  } else {
    console.error(`✗ ${tour.name} — link failed: ${await linkRes.text()}`)
  }

  await unlink(tmpFile).catch(() => {})
}

console.log('\nDone!')
