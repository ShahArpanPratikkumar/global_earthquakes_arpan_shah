/**
 * seedAnalyticsData.js
 * Generates 5000 realistic earthquake records spanning 2018–2025
 * to ensure all analytics charts have meaningful data.
 *
 * Run: node Backend/scripts/seedAnalyticsData.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Earthquake = require('../models/Earthquake.model');

const COUNTRIES = [
  { name: 'Japan', lat: [30, 45], lng: [128, 146] },
  { name: 'Indonesia', lat: [-8, 5], lng: [95, 141] },
  { name: 'Chile', lat: [-55, -18], lng: [-75, -65] },
  { name: 'United States', lat: [32, 49], lng: [-125, -70] },
  { name: 'Turkey', lat: [36, 42], lng: [26, 45] },
  { name: 'Mexico', lat: [15, 30], lng: [-118, -87] },
  { name: 'Nepal', lat: [26, 30], lng: [80, 88] },
  { name: 'Iran', lat: [25, 40], lng: [44, 64] },
  { name: 'Philippines', lat: [5, 20], lng: [116, 127] },
  { name: 'Peru', lat: [-18, -2], lng: [-82, -68] },
  { name: 'New Zealand', lat: [-47, -34], lng: [166, 178] },
  { name: 'Greece', lat: [35, 42], lng: [20, 28] },
  { name: 'Italy', lat: [36, 47], lng: [6, 18] },
  { name: 'China', lat: [20, 50], lng: [75, 135] },
  { name: 'India', lat: [8, 35], lng: [68, 97] },
];

const NETWORKS = ['us', 'ci', 'nc', 'ak', 'pr', 'hv', 'uu', 'uw', 'mb', 'se'];

const PLACES_TEMPLATES = [
  'km NW of {city}, {country}',
  'km SE of {city}, {country}',
  'km NE of {city}, {country}',
  'km SW of {city}, {country}',
  '{country}',
];

const CITIES = {
  Japan: ['Tokyo', 'Osaka', 'Sendai', 'Fukuoka', 'Hiroshima'],
  Indonesia: ['Jakarta', 'Surabaya', 'Medan', 'Ambon', 'Palu'],
  Chile: ['Santiago', 'Concepción', 'Valparaíso', 'Antofagasta', 'La Serena'],
  'United States': ['Los Angeles', 'Seattle', 'Anchorage', 'San Francisco', 'Fairbanks'],
  Turkey: ['Istanbul', 'Ankara', 'Izmir', 'Erzincan', 'Van'],
  Mexico: ['Mexico City', 'Oaxaca', 'Acapulco', 'Puebla', 'Colima'],
  Nepal: ['Kathmandu', 'Pokhara', 'Lalitpur', 'Birgunj', 'Dharan'],
  Iran: ['Tehran', 'Mashhad', 'Tabriz', 'Kerman', 'Ahvaz'],
  Philippines: ['Manila', 'Davao', 'Cebu', 'Zamboanga', 'Legazpi'],
  Peru: ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Ica'],
  'New Zealand': ['Wellington', 'Christchurch', 'Auckland', 'Dunedin', 'Napier'],
  Greece: ['Athens', 'Thessaloniki', 'Heraklion', 'Patras', 'Larissa'],
  Italy: ['Rome', 'Naples', 'L\'Aquila', 'Amatrice', 'Norcia'],
  China: ['Beijing', 'Chengdu', 'Lhasa', 'Urumqi', 'Kunming'],
  India: ['Delhi', 'Mumbai', 'Imphal', 'Bhuj', 'Srinagar'],
};

const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Weighted magnitude: most earthquakes are small (2–4), rare big ones */
function randomMagnitude() {
  const r = Math.random();
  if (r < 0.45) return safeRound(rand(2.0, 3.5), 1);
  if (r < 0.75) return safeRound(rand(3.5, 4.5), 1);
  if (r < 0.92) return safeRound(rand(4.5, 5.5), 1);
  if (r < 0.98) return safeRound(rand(5.5, 6.5), 1);
  return safeRound(rand(6.5, 8.2), 1);
}

function safeRound(n, d) {
  return parseFloat(n.toFixed(d));
}

function generatePlace(country) {
  const cities = CITIES[country.name] || [country.name];
  const city = pick(cities);
  const template = pick(PLACES_TEMPLATES);
  const dist = randInt(5, 200);
  return template
    .replace('{city}', city)
    .replace('{country}', country.name)
    .replace('km', `${dist} km`);
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
  console.log('\n🌱 Analytics Seed Script');
  console.log('========================');

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Connected to MongoDB:', process.env.MONGO_URI);

  const existing = await Earthquake.countDocuments({ isDeleted: { $ne: true } });
  console.log(`📊 Existing records: ${existing}`);

  if (existing >= 2000) {
    console.log('✅ Database already has sufficient data (≥2000 records). Skipping seed.');
    await mongoose.disconnect();
    return;
  }

  console.log('📝 Generating 5000 realistic earthquake records...');

  const START = new Date('2018-01-01');
  const END   = new Date('2025-06-30');
  const BATCH = 500;
  const TOTAL = 5000;

  let inserted = 0;

  for (let b = 0; b < Math.ceil(TOTAL / BATCH); b++) {
    const docs = [];

    for (let i = 0; i < BATCH && inserted + i < TOTAL; i++) {
      const country = pick(COUNTRIES);
      const mag     = randomMagnitude();
      const depth   = safeRound(rand(0, 650), 2);
      const lat     = safeRound(rand(country.lat[0], country.lat[1]), 4);
      const lng     = safeRound(rand(country.lng[0], country.lng[1]), 4);
      const net     = pick(NETWORKS);
      const time    = randomDate(START, END);

      docs.push({
        time,
        latitude:        lat,
        longitude:       lng,
        depth,
        mag,
        magType:         pick(['ml', 'mb', 'mw', 'ms', 'md']),
        nst:             randInt(5, 120),
        gap:             safeRound(rand(20, 350), 1),
        dmin:            safeRound(rand(0.01, 5), 3),
        rms:             safeRound(rand(0.05, 2.5), 2),
        net,
        id:              `gen${Date.now()}${Math.random().toString(36).slice(2, 8)}`,
        updated:         new Date(),
        place:           generatePlace(country),
        type:            'earthquake',
        horizontalError: safeRound(rand(0.1, 15), 2),
        depthError:      safeRound(rand(0.1, 20), 2),
        magError:        safeRound(rand(0.01, 0.3), 3),
        magNst:          randInt(3, 80),
        status:          Math.random() > 0.3 ? 'reviewed' : 'automatic',
        locationSource:  net,
        magSource:       net,
        isDeleted:       false,
      });
    }

    await Earthquake.insertMany(docs, { ordered: false });
    inserted += docs.length;
    console.log(`  ✅ Inserted batch ${b + 1}: ${inserted}/${TOTAL} records`);
  }

  const total = await Earthquake.countDocuments({ isDeleted: { $ne: true } });
  console.log(`\n🎉 Done! Total earthquake records in DB: ${total}`);

  // Quick sanity check
  const countryTest = await Earthquake.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $addFields: { country: { $trim: { input: { $arrayElemAt: [{ $split: ['$place', ', '] }, -1] } } } } },
    { $group: { _id: '$country', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  console.log('\n📊 Top 5 countries:');
  countryTest.forEach(c => console.log(`   ${c._id}: ${c.count} events`));

  await mongoose.disconnect();
  console.log('\n✅ Seed complete!\n');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
