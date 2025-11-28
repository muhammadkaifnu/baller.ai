import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://muhammadkaifnu_db_user:dd7499a8@cluster0.eybpzsa.mongodb.net/football?retryWrites=true&w=majority';

async function removeDuplicates() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tlsAllowInvalidCertificates: true
    });
    console.log('✓ MongoDB connected');

    const playersCollection = mongoose.connection.db.collection('players');
    
    // Get all players
    const allPlayers = await playersCollection.find({}).toArray();
    console.log(`📦 Total players before cleanup: ${allPlayers.length}`);

    // Group by player name and team to find duplicates
    const uniquePlayers = new Map();
    
    for (const player of allPlayers) {
      const key = `${player.basic_info.name}_${player.current_club.name}`.toLowerCase();
      
      if (!uniquePlayers.has(key)) {
        uniquePlayers.set(key, player);
      } else {
        // Keep the one with more data (more goals/assists)
        const existing = uniquePlayers.get(key);
        const existingGoals = existing.season_stats?.goals || 0;
        const newGoals = player.season_stats?.goals || 0;
        
        if (newGoals > existingGoals) {
          uniquePlayers.set(key, player);
        }
      }
    }

    console.log(`✓ Found ${uniquePlayers.size} unique players`);
    console.log(`✗ Removing ${allPlayers.length - uniquePlayers.size} duplicates`);

    // Drop collection and insert unique players
    await playersCollection.drop();
    console.log('✓ Dropped players collection');

    const uniquePlayersArray = Array.from(uniquePlayers.values());
    
    // Insert in batches
    const batchSize = 1000;
    for (let i = 0; i < uniquePlayersArray.length; i += batchSize) {
      const batch = uniquePlayersArray.slice(i, i + batchSize);
      await playersCollection.insertMany(batch);
      console.log(`✓ Inserted batch ${Math.floor(i / batchSize) + 1} (${Math.min(i + batchSize, uniquePlayersArray.length)} players)`);
    }

    // Verify
    const finalCount = await playersCollection.countDocuments();
    console.log(`\n✅ Cleanup complete!`);
    console.log(`📊 Total unique players: ${finalCount}`);

    // Test search for Declan Rice
    const riceResults = await playersCollection.find({
      'basic_info.name': { $regex: 'Declan Rice', $options: 'i' }
    }).toArray();
    console.log(`\n🔍 Declan Rice entries: ${riceResults.length}`);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
}

removeDuplicates();
