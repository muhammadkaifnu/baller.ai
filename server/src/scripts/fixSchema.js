import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://muhammadkaifnu_db_user:dd7499a8@cluster0.eybpzsa.mongodb.net/football?retryWrites=true&w=majority';

async function fixSchema() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tlsAllowInvalidCertificates: true
    });
    console.log('✓ MongoDB connected');

    // Drop the entire players collection
    try {
      await mongoose.connection.db.dropCollection('players');
      console.log('✓ Dropped players collection');
    } catch (err) {
      console.log('ℹ No collection to drop');
    }

    // Insert a simple test player directly
    const playersCollection = mongoose.connection.db.collection('players');
    
    const testPlayer = {
      player_id: 'test_player',
      basic_info: {
        name: 'Test Player',
        position: 'ST',
        image: 'https://via.placeholder.com/150'
      },
      current_club: {
        name: 'Test Club'
      },
      fifa_ratings: {
        overall: 85
      },
      season_stats: {
        goals: 10
      },
      advanced_stats: {},
      playing_style: 'Test',
      strengths: ['Test'],
      weaknesses: ['Test'],
      recent_matches: [],
      transfer_history: [],
      trophies: []
    };

    await playersCollection.insertOne(testPlayer);
    console.log('✓ Inserted test player directly');

    // Verify
    const count = await playersCollection.countDocuments();
    console.log(`✓ Total players: ${count}`);

    const players = await playersCollection.find({}).toArray();
    console.log('✓ Players:', players.map(p => p.basic_info.name));

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
}

fixSchema();
