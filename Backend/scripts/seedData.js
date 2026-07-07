require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Earthquake = require('../models/Earthquake.model');

const DATASET_PATH = path.join(__dirname, '../data/earthquakes.json');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if dataset file exists
    if (!fs.existsSync(DATASET_PATH)) {
      console.error('❌ Dataset file not found at:', DATASET_PATH);
      console.log('📝 Please download the dataset from Google Drive and place it as:');
      console.log('   Backend/data/earthquakes.json');
      process.exit(1);
    }

    // Read the JSON dataset
    console.log('📂 Reading dataset file...');
    const rawData = fs.readFileSync(DATASET_PATH, 'utf-8');
    let records;

    try {
      records = JSON.parse(rawData);
    } catch (parseError) {
      console.error('❌ Invalid JSON format:', parseError.message);
      process.exit(1);
    }

    // Handle both array format and GeoJSON feature collection format
    let earthquakeRecords = [];

    if (Array.isArray(records)) {
      earthquakeRecords = records;
    } else if (records.features && Array.isArray(records.features)) {
      // GeoJSON format (USGS)
      earthquakeRecords = records.features.map((feature) => ({
        time: new Date(feature.properties.time),
        latitude: feature.geometry?.coordinates?.[1],
        longitude: feature.geometry?.coordinates?.[0],
        depth: feature.geometry?.coordinates?.[2],
        mag: feature.properties.mag,
        magType: feature.properties.magType,
        nst: feature.properties.nst,
        gap: feature.properties.gap,
        dmin: feature.properties.dmin,
        rms: feature.properties.rms,
        net: feature.properties.net,
        id: feature.properties.id || feature.id,
        updated: feature.properties.updated ? new Date(feature.properties.updated) : null,
        place: feature.properties.place,
        type: feature.properties.type || 'earthquake',
        horizontalError: feature.properties.horizontalError,
        depthError: feature.properties.depthError,
        magError: feature.properties.magError,
        magNst: feature.properties.magNst,
        status: feature.properties.status || 'automatic',
        locationSource: feature.properties.locationSource,
        magSource: feature.properties.magSource,
      }));
    } else if (records.time !== undefined) {
      // CSV-converted JSON (flat array of objects with field names as keys)
      earthquakeRecords = Array.isArray(records) ? records : [records];
    } else {
      // Try to find any array property
      const firstArrayKey = Object.keys(records).find((k) => Array.isArray(records[k]));
      if (firstArrayKey) {
        earthquakeRecords = records[firstArrayKey];
      } else {
        console.error('❌ Unrecognized JSON structure. Expected array or GeoJSON FeatureCollection.');
        process.exit(1);
      }
    }

    // Map flat CSV-style records if needed (field names match USGS CSV export)
    if (earthquakeRecords.length > 0 && earthquakeRecords[0].time && typeof earthquakeRecords[0].time === 'string') {
      earthquakeRecords = earthquakeRecords.map((r, idx) => ({
        time: r.time ? new Date(r.time) : new Date(),
        latitude: parseFloat(r.latitude) || 0,
        longitude: parseFloat(r.longitude) || 0,
        depth: parseFloat(r.depth) || 0,
        mag: parseFloat(r.mag) || 0,
        magType: r.magType || null,
        nst: r.nst !== undefined && r.nst !== '' ? parseInt(r.nst) : null,
        gap: r.gap !== undefined && r.gap !== '' ? parseFloat(r.gap) : null,
        dmin: r.dmin !== undefined && r.dmin !== '' ? parseFloat(r.dmin) : null,
        rms: r.rms !== undefined && r.rms !== '' ? parseFloat(r.rms) : null,
        net: r.net || null,
        id: r.id || `eq_${idx}_${Date.now()}`,
        updated: r.updated ? new Date(r.updated) : null,
        place: r.place || 'Unknown location',
        type: r.type || 'earthquake',
        horizontalError: r.horizontalError !== undefined && r.horizontalError !== '' ? parseFloat(r.horizontalError) : null,
        depthError: r.depthError !== undefined && r.depthError !== '' ? parseFloat(r.depthError) : null,
        magError: r.magError !== undefined && r.magError !== '' ? parseFloat(r.magError) : null,
        magNst: r.magNst !== undefined && r.magNst !== '' ? parseInt(r.magNst) : null,
        status: ['automatic', 'reviewed', 'deleted'].includes(r.status) ? r.status : 'automatic',
        locationSource: r.locationSource || null,
        magSource: r.magSource || null,
      }));
    }

    console.log(`📊 Total records to import: ${earthquakeRecords.length}`);

    // Clear existing records
    console.log('🗑️  Clearing existing earthquake records...');
    await Earthquake.deleteMany({});

    // Batch insert for performance
    const BATCH_SIZE = 1000;
    let inserted = 0;
    for (let i = 0; i < earthquakeRecords.length; i += BATCH_SIZE) {
      const batch = earthquakeRecords.slice(i, i + BATCH_SIZE);
      try {
        await Earthquake.insertMany(batch, { ordered: false });
        inserted += batch.length;
        console.log(`  ↳ Inserted ${inserted}/${earthquakeRecords.length} records...`);
      } catch (batchError) {
        console.warn(`  ⚠️  Batch ${Math.floor(i / BATCH_SIZE) + 1} had some errors (duplicates skipped): ${batchError.message.slice(0, 100)}`);
      }
    }

    const finalCount = await Earthquake.countDocuments();
    console.log(`\n✅ Seeding complete! ${finalCount} earthquake records in database.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
