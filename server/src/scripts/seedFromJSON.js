import mongoose from 'mongoose';
import Player from '../models/Player.js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://muhammadkaifnu_db_user:dd7499a8@cluster0.eybpzsa.mongodb.net/football?retryWrites=true&w=majority';

async function seedPlayers() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tlsAllowInvalidCertificates: true
    });
    console.log('✓ MongoDB connected');

    const playersData = JSON.parse(readFileSync(join(__dirname, 'players.json'), 'utf-8'));
    console.log(`📦 Loaded ${playersData.length} players from JSON`);

    try {
      await mongoose.connection.db.dropCollection('players');
      console.log('✓ Dropped players collection');
    } catch (err) {
      console.log('ℹ No existing collection to drop');
    }

    for (const playerData of playersData) {
      try {
        const player = new Player(playerData);
        await player.save();
        console.log(`✓ Inserted ${playerData.basic_info.name}`);
      } catch (err) {
        console.error(`✗ Error inserting ${playerData.basic_info.name}:`, err.message);
      }
    }

    console.log('\n✅ Player seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

seedPlayers();
