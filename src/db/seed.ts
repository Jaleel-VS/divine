import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { tours } from './schema.ts'

config({ path: ['.env.local', '.env'] })

const db = drizzle(process.env.DATABASE_URL!)

const tourData = [
  {
    name: 'Sossusvlei & the Heart of the Namib',
    tagline: 'The dunes that stop you mid-breath.',
    description:
      "The red sand dunes of Sossusvlei are among the oldest and tallest in the world — some reaching over 300 metres. We climb Big Daddy at first light, walk the ghostly floor of Dead Vlei, and spend two nights in a desert lodge with the Milky Way overhead. This is Namibia at its most iconic, experienced with the depth it deserves.",
    location: 'Namib Desert, Namibia',
    duration: 5,
    price: 2800,
    maxGuests: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80',
    highlights: JSON.stringify([
      'Big Daddy dune climb at sunrise',
      'Dead Vlei ancient camel thorn forest',
      'Night drive for nocturnal desert wildlife',
      'Sesriem Canyon exploration',
      'Private desert lodge with open-air dining',
    ]),
  },
  {
    name: 'Etosha Salt Pan Safari',
    tagline: 'Africa\'s most extraordinary game park.',
    description:
      "Etosha is unlike any other park on the continent. A vast white salt pan stretches to the horizon, and around its edges the entire cast of Namibian wildlife gathers at waterholes — elephant, lion, rhino, giraffe, and hundreds of bird species. We base you in a private concession bordering the park for exclusive early-morning and night access.",
    location: 'Etosha, Namibia',
    duration: 6,
    price: 3400,
    maxGuests: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
    highlights: JSON.stringify([
      'Big Five game drives (dawn, dusk and night)',
      'Floodlit waterhole viewing from the lodge',
      'Black and white rhino sightings',
      'Over 340 bird species in the park',
      'Private concession with exclusive access',
    ]),
  },
  {
    name: 'Skeleton Coast Expedition',
    tagline: 'The shipwreck coast of the world.',
    description:
      "The Skeleton Coast is one of the most remote and dramatic places on earth — a 500-kilometre stretch of wild Atlantic coastline where the cold Benguela current meets the Namib Desert. Seal colonies, desert-adapted lions, shipwrecks half-buried in sand, and a silence that is almost physical. Access is strictly limited and requires a licensed fly-in operator. We are one of them.",
    location: 'Skeleton Coast, Namibia',
    duration: 4,
    price: 4200,
    maxGuests: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    highlights: JSON.stringify([
      'Fly-in access to the restricted northern zone',
      'Cape fur seal colony at Möwe Bay',
      'Desert-adapted lion tracking',
      'Historic shipwreck sites',
      'Brown hyena and desert elephant sightings',
    ]),
  },
  {
    name: 'Damaraland & Desert Rhino',
    tagline: 'Track the rarest rhino on earth on foot.',
    description:
      "Damaraland is ancient country — volcanic rock formations, San rock engravings dating back 6,000 years, and the world's largest free-roaming population of desert-adapted black rhino. We partner exclusively with the Save the Rhino Trust to offer guided tracking on foot. Walking within metres of a wild rhino in open desert is an experience without parallel.",
    location: 'Damaraland, Namibia',
    duration: 5,
    price: 3100,
    maxGuests: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=1200&q=80',
    highlights: JSON.stringify([
      'Desert black rhino tracking on foot',
      'Desert-adapted elephant encounters',
      'Twyfelfontein ancient San rock engravings (UNESCO)',
      'Petrified Forest geological walk',
      'Communal conservancy overnight stay',
    ]),
  },
  {
    name: 'Fish River Canyon Trek',
    tagline: 'Five days at the bottom of the world.',
    description:
      "The Fish River Canyon is the second-largest canyon on earth — 160 kilometres long, 27 kilometres wide, and up to 550 metres deep. The five-day hiking trail along the canyon floor is one of Africa's great wilderness walks: no guides required below the rim, no facilities, no phone signal. Just the canyon, the river, and your team. We handle all logistics and support.",
    location: 'Fish River Canyon, Namibia',
    duration: 7,
    price: 1900,
    maxGuests: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
    highlights: JSON.stringify([
      '85km canyon floor trail (May–September only)',
      'Natural hot spring pools at Ai-Ais',
      'Ancient geological formations (600 million years)',
      'Full logistics, permits and camping support',
      'Pre-trek night at canyon rim with sunset views',
    ]),
  },
  {
    name: 'Namibia Grand Circuit',
    tagline: 'The whole country in twelve days.',
    description:
      "This is the definitive Namibia experience — a twelve-day loop from Windhoek that covers the country's most extraordinary landscapes without ever feeling rushed. Dunes at Sossusvlei, game at Etosha, desert wildlife in Damaraland, and the wild Atlantic at Swakopmund. We combine private lodges with one night camping under the stars in the Namib. Best suited to first-time Namibia visitors who want the full picture.",
    location: 'Namibia (Full Circuit)',
    duration: 12,
    price: 5800,
    maxGuests: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',
    highlights: JSON.stringify([
      'Sossusvlei dunes and Dead Vlei',
      'Etosha National Park — three days',
      'Damaraland desert wildlife and rock art',
      'Swakopmund adventure activities (optional)',
      'One night wild camping in the Namib Desert',
    ]),
  },
]

await db.delete(tours)
await db.insert(tours).values(tourData)

console.log(`✓ Seeded ${tourData.length} tours`)
process.exit(0)
