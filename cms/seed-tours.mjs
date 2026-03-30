// Seed tours into Strapi via the admin API
// Usage: STRAPI_ADMIN_EMAIL=x STRAPI_ADMIN_PASSWORD=y node seed-tours.mjs

const STRAPI = process.env.STRAPI_URL || 'http://localhost:1337'
const EMAIL = process.env.STRAPI_ADMIN_EMAIL
const PASSWORD = process.env.STRAPI_ADMIN_PASSWORD

if (!EMAIL || !PASSWORD) {
  console.error('Set STRAPI_ADMIN_EMAIL and STRAPI_ADMIN_PASSWORD')
  process.exit(1)
}

// Get admin JWT
const loginRes = await fetch(`${STRAPI}/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
})
const { data: loginData } = await loginRes.json()
const jwt = loginData.token

const tours = [
  {
    name: 'Namib Desert',
    slug: 'namib-desert',
    tagline: 'The dunes that stop you mid-breath.',
    description: 'The red sand dunes of Sossusvlei are among the oldest and tallest in the world — some reaching over 300 metres. We climb Big Daddy at first light, walk the ghostly floor of Dead Vlei, and spend two nights in a desert lodge with the Milky Way overhead. This is Namibia at its most iconic, experienced with the depth it deserves.',
    location: 'Namib Desert, Namibia',
    duration: 5,
    price: 1600,
    maxGuests: 8,
    highlights: ['Big Daddy dune climb at sunrise', 'Dead Vlei ancient camel thorn forest', 'Night drive for nocturnal desert wildlife', 'Sesriem Canyon exploration', 'Private desert lodge with open-air dining'],
    featured: true,
  },
  {
    name: 'Etosha Park',
    slug: 'etosha-park',
    tagline: "Africa's most extraordinary game park.",
    description: "Etosha is unlike any other park on the continent. A vast white salt pan stretches to the horizon, and around its edges the entire cast of Namibian wildlife gathers at waterholes — elephant, lion, rhino, giraffe, and hundreds of bird species. We base you in a private concession bordering the park for exclusive early-morning and night access.",
    location: 'Etosha, Namibia',
    duration: 6,
    price: 1375,
    maxGuests: 10,
    highlights: ['Big Five game drives (dawn, dusk and night)', 'Floodlit waterhole viewing from the lodge', 'Black and white rhino sightings', 'Over 340 bird species in the park', 'Private concession with exclusive access'],
    featured: true,
  },
  {
    name: 'Kunene & Etosha Park',
    slug: 'kunene-and-etosha-park',
    tagline: 'Remote wilderness meets iconic game country.',
    description: 'Combine the raw, untouched landscapes of the Kunene region with the wildlife spectacle of Etosha National Park. The Kunene River forms the border with Angola — home to Himba communities, desert-adapted elephant, and dramatic gorges. From there we head south into Etosha for classic game viewing at its finest.',
    location: 'Kunene & Etosha, Namibia',
    duration: 8,
    price: 2050,
    maxGuests: 8,
    highlights: ['Kunene River gorge and Epupa Falls', 'Himba cultural village visit', 'Desert-adapted elephant encounters', 'Etosha National Park game drives', 'Remote fly-camp under the stars'],
    featured: true,
  },
  {
    name: 'Southern Namibia & Namib Desert',
    slug: 'southern-namibia-and-namib-desert',
    tagline: 'Canyon country and ancient desert landscapes.',
    description: "Southern Namibia is the country's least-visited and most dramatic region. The Fish River Canyon — second largest on earth — anchors this route, combined with the sweeping dune fields of the southern Namib, the quiver tree forests of the Keetmanshoop plateau, and the ghost town of Kolmanskop. A journey through deep geological time.",
    location: 'Southern Namibia',
    duration: 7,
    price: 2190,
    maxGuests: 8,
    highlights: ['Fish River Canyon rim and floor views', 'Quiver tree forest at sunset', 'Kolmanskop ghost town exploration', 'Southern Namib dune landscapes', 'Ai-Ais hot spring pools'],
    featured: false,
  },
  {
    name: 'Desert/Coastal/Etosha Park',
    slug: 'desert-coastal-etosha-park',
    tagline: 'Three landscapes. One unforgettable journey.',
    description: "This route covers Namibia's three most distinct environments — the ancient Namib Desert, the wild Atlantic coastline around Swakopmund, and the game-rich plains of Etosha. It's the ideal introduction to the country's full range, moving from dunes to ocean to savannah in a single trip.",
    location: 'Namib, Swakopmund & Etosha, Namibia',
    duration: 9,
    price: 3150,
    maxGuests: 10,
    highlights: ['Sossusvlei dunes and Dead Vlei', 'Swakopmund coastal activities', 'Skeleton Coast scenic drive', 'Etosha National Park — two days', 'Private lodge accommodation throughout'],
    featured: false,
  },
  {
    name: 'Customised Namibian Experience',
    slug: 'customised-namibian-experience',
    tagline: 'Your Namibia, built around you.',
    description: "Not every traveller fits a fixed itinerary. If you have specific interests — photography, birding, cultural immersion, family travel, or simply more time in one place — we'll build a trip around you. Tell us what matters most and we'll handle the rest. Every customised experience is planned personally by Graham.",
    location: 'Namibia (Flexible)',
    duration: 10,
    price: 0,
    maxGuests: 12,
    highlights: ['Fully flexible itinerary', 'Personally planned by Graham van Staden', 'Any region, any pace, any focus', 'Private or small group options', 'Pricing on request'],
    featured: false,
  },
]

for (const tour of tours) {
  const res = await fetch(`${STRAPI}/content-manager/collection-types/api::tour.tour`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(tour),
  })
  const result = await res.json()
  if (res.ok) {
    // Publish the document
    await fetch(`${STRAPI}/content-manager/collection-types/api::tour.tour/${result.data.documentId}/actions/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    })
    console.log(`✓ ${tour.name} (created & published)`)
  } else {
    console.error(`✗ ${tour.name}:`, result.error?.message || result)
  }
}

console.log('\nDone! Set public permissions in Strapi admin:')
console.log('Settings → Users & Permissions → Roles → Public')
console.log('  Tour: find, findOne')
console.log('  Inquiry: create')
