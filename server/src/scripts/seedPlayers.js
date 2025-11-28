import mongoose from 'mongoose';
import Player from '../models/Player.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://muhammadkaifnu_db_user:dd7499a8@cluster0.eybpzsa.mongodb.net/football?retryWrites=true&w=majority';

const samplePlayers = [
  {
    player_id: 'haaland_erling',
    basic_info: {
      name: 'Erling Haaland',
      full_name: 'Erling Braut Haaland',
      age: 24,
      date_of_birth: '2000-07-21',
      nationality: 'Norway',
      position: 'ST',
      preferred_foot: 'Left',
      height: '194 cm',
      weight: '88 kg',
      image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png'
    },
    current_club: {
      name: 'Manchester City',
      position: 'Striker',
      jersey_number: 9,
      joined_date: '2022-07-01',
      contract_until: '2027-06-30',
      market_value: '€180M'
    },
    fifa_ratings: {
      overall: 91,
      potential: 94,
      pace: 89,
      shooting: 94,
      passing: 71,
      dribbling: 81,
      defending: 45,
      physical: 88
    },
    season_stats: {
      season: '2024/25',
      appearances: 15,
      goals: 21,
      assists: 3,
      minutes_played: 1350,
      goals_per_90: 1.4,
      assists_per_90: 0.2,
      yellow_cards: 2,
      red_cards: 0
    },
    advanced_stats: {
      xG: 18.5,
      xA: 2.8,
      pass_completion: 78.5,
      key_passes_per_90: 0.8,
      dribbles_per_90: 1.2,
      tackles_per_90: 0.3,
      interceptions_per_90: 0.2,
      aerial_duels_won: 65.2
    },
    playing_style: 'A clinical finisher with exceptional pace and positioning.',
    strengths: ['Finishing', 'Pace', 'Positioning'],
    weaknesses: ['Passing Range'],
    recent_matches: [
      { date: '2024-11-23', opponent: 'Tottenham', result: 'W 3-0', minutes: 90, goals: 2, assists: 0, rating: 9.2 }
    ],
    transfer_history: [
      { date: '2022-07-01', from: 'Borussia Dortmund', to: 'Manchester City', fee: '€60M', type: 'Transfer' }
    ],
    trophies: [
      { title: 'Premier League', season: '2023/24', competition: 'League' }
    ]
  }
];

async function seedPlayers() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tlsAllowInvalidCertificates: true
    });
    console.log('✓ MongoDB connected');

    // Drop the collection to clear any schema issues
    try {
      await mongoose.connection.db.dropCollection('players');
      console.log('✓ Dropped players collection');
    } catch (err) {
      console.log('ℹ No existing collection to drop');
    }

    // Insert players one by one with better error handling
    for (const playerData of samplePlayers) {
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
    console.error('✗ Error seeding players:', error.message);
    process.exit(1);
  }
}

seedPlayers();
