import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { tours } from './schema.ts'

config({ path: ['.env.local', '.env'] })

const db = drizzle(process.env.DATABASE_URL!)

const tourData = [
  {
    name: 'The Great Serengeti Migration',
    tagline: 'Two million animals. One spectacle.',
    description:
      "Experience the raw power of the world's greatest wildlife spectacle as millions of wildebeest thunder across the Serengeti plains. Camp under the stars in private conservancies, witness dramatic river crossings, and explore the endless golden grasslands that have captivated explorers for centuries. This is Africa at its most elemental — loud, relentless, and unforgettable.",
    location: 'Serengeti, Tanzania',
    duration: 8,
    price: 4800,
    maxGuests: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',
    highlights: JSON.stringify([
      'Great Wildebeest Migration river crossings',
      'Ngorongoro Crater full-day game drive',
      'Sunrise hot air balloon safari',
      'Big Five sightings guaranteed',
      'Private tented camp under the stars',
    ]),
  },
  {
    name: 'Okavango Delta Expedition',
    tagline: 'Where rivers vanish into the desert.',
    description:
      "Glide through papyrus-lined channels by mokoro canoe and walk the floodplains with expert San trackers. The Okavango Delta is one of Africa's last true wilderness areas — a jewel of biodiversity where elephants, hippos and wild dogs thrive in the heart of the Kalahari. No roads. No crowds. Just water, sky and wildlife.",
    location: 'Okavango Delta, Botswana',
    duration: 6,
    price: 5500,
    maxGuests: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
    highlights: JSON.stringify([
      'Mokoro canoe safari through channels',
      'Walking safari with San trackers',
      'Wild dog territory game drives',
      'Bush dinners under the stars',
      'Scenic helicopter flight over the delta',
    ]),
  },
  {
    name: 'Rwanda Gorilla Trek',
    tagline: 'Sit with the giants of the forest.',
    description:
      'A rare and profound encounter awaits deep in the ancient Volcanoes rainforest. Spend a precious hour in the presence of mountain gorillas — watching them play, feed and rest in their natural habitat. With fewer than 1,000 remaining in the wild, each encounter directly funds conservation. An experience that changes you permanently.',
    location: 'Volcanoes National Park, Rwanda',
    duration: 4,
    price: 3200,
    maxGuests: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=1200&q=80',
    highlights: JSON.stringify([
      'Habituated gorilla family trekking',
      'Golden monkey tracking',
      'Kigali city and genocide memorial tour',
      'Community village visit',
      'Researcher conservation briefing',
    ]),
  },
  {
    name: 'Kruger Classic Safari',
    tagline: "South Africa's crown wilderness.",
    description:
      "The iconic Kruger National Park needs no introduction. Home to the Big Five and over 500 bird species, this classic safari pairs luxury bush lodges with expert ranger-led game drives at dawn and dusk. Tracking lions on foot, scanning the riverine forest for leopards at night, and falling asleep to hyena calls — Kruger delivers it all.",
    location: 'Limpopo, South Africa',
    duration: 7,
    price: 3800,
    maxGuests: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=1200&q=80',
    highlights: JSON.stringify([
      'Big Five game drives (dawn and dusk)',
      'Leopard tracking by spotlight at night',
      'Walking safari with armed field rangers',
      'Private concession access (no crowds)',
      'Luxury lodge with bush plunge pool',
    ]),
  },
  {
    name: 'Namibia Desert & Wildlife',
    tagline: 'Silence, space, and infinite sky.',
    description:
      "Namibia is Africa in extremis — vast, stark and breathtakingly beautiful. Climb the famous red dunes of Sossusvlei at dawn, track desert-adapted lions through Palmwag's granite mountains, and end at the seal-crowded shores of the Skeleton Coast. A landscape unlike anywhere else on earth, best experienced in total silence.",
    location: 'Namibia',
    duration: 9,
    price: 5200,
    maxGuests: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80',
    highlights: JSON.stringify([
      'Sossusvlei dune climb at sunrise',
      'Desert-adapted lion and elephant tracking',
      'Skeleton Coast fly-in expedition',
      'Etosha pan full-day game drives',
      'Himba community cultural interaction',
    ]),
  },
  {
    name: 'Kenya Masai Mara Explorer',
    tagline: 'The original African safari.',
    description:
      'The Masai Mara is where safari was born — and it remains the gold standard. Endless open plains, Maasai warriors, and some of the highest concentrations of big cats on earth. September and October bring the tail end of the Great Migration; the rest of the year offers exceptional resident predators and a landscape that stops you cold.',
    location: 'Masai Mara, Kenya',
    duration: 5,
    price: 3600,
    maxGuests: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&q=80',
    highlights: JSON.stringify([
      'Cheetah and lion sightings daily',
      'Maasai village cultural visit',
      'Hot air balloon over the Mara at sunrise',
      'Sundowner on the open plains',
      'Migration river crossings (Jul–Oct)',
    ]),
  },
]

await db.delete(tours)
await db.insert(tours).values(tourData)

console.log(`✓ Seeded ${tourData.length} tours`)
process.exit(0)
