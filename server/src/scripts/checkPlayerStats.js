import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://muhammadkaifnu_db_user:dd7499a8@cluster0.eybpzsa.mongodb.net/football?retryWrites=true&w=majority';

async function checkPlayerStats() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tlsAllowInvalidCertificates: true
    });
    console.log('✓ MongoDB connected');

    // Check player_stats collection
    const playerStatsCollection = mongoose.connection.db.collection('player_stats');
    const count = await playerStatsCollection.countDocuments();
    console.log(`\n📊 Total players in player_stats: ${count}`);

    // Get sample players
    const samplePlayers = await playerStatsCollection.find({}).limit(20).toArray();
    
    console.log('\n👥 Sample players from player_stats:');
    samplePlayers.forEach((player, idx) => {
      console.log(`${idx + 1}. ${player.player || player.name || 'Unknown'} - Team: ${player.team || 'Unknown'}`);
    });

    // Show structure of first player
    if (samplePlayers.length > 0) {
      console.log('\n📋 Structure of first player:');
      console.log(JSON.stringify(samplePlayers[0], null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
}

checkPlayerStats();
