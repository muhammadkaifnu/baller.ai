import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://muhammadkaifnu_db_user:dd7499a8@cluster0.eybpzsa.mongodb.net/football?retryWrites=true&w=majority';

// Helper to generate player ID
function generatePlayerId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
}

// Helper to get position abbreviation
function getPositionAbbr(pos) {
  const posMap = {
    'DF': 'CB', 'MF': 'CM', 'FW': 'ST', 'GK': 'GK'
  };
  return posMap[pos] || pos;
}

// Helper to calculate overall rating
function calculateOverall(stats) {
  const goals = stats.Performance_Gls || 0;
  const assists = stats.Performance_Ast || 0;
  const minutes = stats['Playing Time_Min'] || 0;
  const age = stats.age_ || 25;
  
  let base = 70;
  if (minutes > 1000) base += 5;
  if (goals > 10) base += 5;
  if (assists > 5) base += 3;
  if (age < 25) base += 2;
  
  return Math.min(90, Math.max(65, base));
}

async function migratePlayerStats() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tlsAllowInvalidCertificates: true
    });
    console.log('✓ MongoDB connected');

    const playerStatsCollection = mongoose.connection.db.collection('player_stats');
    const playersCollection = mongoose.connection.db.collection('players');

    // Get all players from player_stats
    const allPlayerStats = await playerStatsCollection.find({}).toArray();
    console.log(`📦 Found ${allPlayerStats.length} players in player_stats`);

    // Drop existing players collection
    try {
      await playersCollection.drop();
      console.log('✓ Dropped players collection');
    } catch (err) {
      console.log('ℹ No existing collection to drop');
    }

    let inserted = 0;
    let skipped = 0;

    for (const stats of allPlayerStats) {
      try {
        const player = {
          player_id: generatePlayerId(stats.player),
          basic_info: {
            name: stats.player,
            age: stats.age_ || 25,
            date_of_birth: stats.born_ ? `${stats.born_}-01-01` : '1999-01-01',
            nationality: stats.nation_ || 'Unknown',
            position: getPositionAbbr(stats.pos_),
            height: '180 cm',
            weight: '75 kg',
            image: `https://via.placeholder.com/150?text=${encodeURIComponent(stats.player)}`
          },
          current_club: {
            name: stats.team || 'Unknown',
            position: getPositionAbbr(stats.pos_),
            jersey_number: 10,
            market_value: '€10M'
          },
          fifa_ratings: {
            overall: calculateOverall(stats),
            potential: calculateOverall(stats) + 2,
            pace: 75,
            shooting: 75,
            passing: 75,
            dribbling: 75,
            defending: stats.pos_ === 'DF' ? 80 : 50,
            physical: 75
          },
          season_stats: {
            season: '2024/25',
            appearances: stats['Playing Time_MP'] || 0,
            goals: stats.Performance_Gls || 0,
            assists: stats.Performance_Ast || 0,
            minutes_played: stats['Playing Time_Min'] || 0,
            goals_per_90: stats['Per 90 Minutes_Gls'] || 0,
            assists_per_90: stats['Per 90 Minutes_Ast'] || 0,
            yellow_cards: stats.Performance_CrdY || 0,
            red_cards: stats.Performance_CrdR || 0
          },
          advanced_stats: {
            xG: stats.Expected_xG || 0,
            xA: stats.Expected_xAG || 0,
            pass_completion: 80.0,
            key_passes_per_90: 1.5,
            dribbles_per_90: 2.0,
            tackles_per_90: 1.0,
            interceptions_per_90: 0.5,
            aerial_duels_won: 50.0
          },
          playing_style: `${stats.pos_} player for ${stats.team}`,
          strengths: ['Technical', 'Tactical'],
          weaknesses: ['Consistency'],
          recent_matches: [],
          transfer_history: [],
          trophies: []
        };

        await playersCollection.insertOne(player);
        inserted++;
        
        if (inserted % 1000 === 0) {
          console.log(`✓ Inserted ${inserted} players...`);
        }
      } catch (err) {
        skipped++;
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`✓ Inserted: ${inserted} players`);
    console.log(`✗ Skipped: ${skipped} players`);

    // Verify
    const finalCount = await playersCollection.countDocuments();
    console.log(`📊 Total players in database: ${finalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
}

migratePlayerStats();
