import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read existing players
const existingPlayers = JSON.parse(readFileSync(join(__dirname, 'players.json'), 'utf-8'));
console.log(`📦 Existing players: ${existingPlayers.length}`);

// New players to add (simplified data - will be expanded)
const newPlayersData = [
  // Premier League
  { id: "saka_bukayo", name: "Bukayo Saka", team: "Arsenal", pos: "RW", rating: 87, nat: "England" },
  { id: "odegaard_martin", name: "Martin Ødegaard", team: "Arsenal", pos: "CAM", rating: 88, nat: "Norway" },
  { id: "rice_declan", name: "Declan Rice", team: "Arsenal", pos: "CDM", rating: 87, nat: "England" },
  { id: "palmer_cole", name: "Cole Palmer", team: "Chelsea", pos: "CAM", rating: 84, nat: "England" },
  { id: "foden_phil", name: "Phil Foden", team: "Manchester City", pos: "CAM", rating: 88, nat: "England" },
  { id: "rodri", name: "Rodri", team: "Manchester City", pos: "CDM", rating: 91, nat: "Spain" },
  { id: "son_heungmin", name: "Son Heung-min", team: "Tottenham", pos: "LW", rating: 89, nat: "South Korea" },
  
  // La Liga
  { id: "pedri", name: "Pedri", team: "Barcelona", pos: "CM", rating: 85, nat: "Spain" },
  { id: "gavi", name: "Gavi", team: "Barcelona", pos: "CM", rating: 83, nat: "Spain" },
  { id: "modric_luka", name: "Luka Modrić", team: "Real Madrid", pos: "CM", rating: 88, nat: "Croatia" },
  { id: "valverde_fede", name: "Federico Valverde", team: "Real Madrid", pos: "CM", rating: 87, nat: "Uruguay" },
  
  // Serie A
  { id: "lautaro_martinez", name: "Lautaro Martínez", team: "Inter Milan", pos: "ST", rating: 88, nat: "Argentina" },
  { id: "leao_rafael", name: "Rafael Leão", team: "AC Milan", pos: "LW", rating: 86, nat: "Portugal" },
  { id: "vlahovic_dusan", name: "Dušan Vlahović", team: "Juventus", pos: "ST", rating: 85, nat: "Serbia" },
  
  // Bundesliga
  { id: "musiala_jamal", name: "Jamal Musiala", team: "Bayern Munich", pos: "CAM", rating: 86, nat: "Germany" },
  { id: "sane_leroy", name: "Leroy Sané", team: "Bayern Munich", pos: "LW", rating: 86, nat: "Germany" },
  { id: "wirtz_florian", name: "Florian Wirtz", team: "Bayer Leverkusen", pos: "CAM", rating: 85, nat: "Germany" },
];

// Generate full player objects
const newPlayers = newPlayersData.map(p => ({
  player_id: p.id,
  basic_info: {
    name: p.name,
    age: 24,
    nationality: p.nat,
    position: p.pos,
    height: "180 cm",
    weight: "75 kg",
    image: `https://via.placeholder.com/150?text=${p.name.replace(' ', '+')}`
  },
  current_club: {
    name: p.team,
    position: p.pos,
    jersey_number: 10,
    market_value: "€50M"
  },
  fifa_ratings: {
    overall: p.rating,
    potential: p.rating + 2,
    pace: 80,
    shooting: 80,
    passing: 80,
    dribbling: 80,
    defending: 50,
    physical: 75
  },
  season_stats: {
    season: "2024/25",
    appearances: 15,
    goals: 8,
    assists: 5,
    minutes_played: 1350,
    goals_per_90: 0.53,
    assists_per_90: 0.33,
    yellow_cards: 2,
    red_cards: 0
  },
  advanced_stats: {
    xG: 7.5,
    xA: 4.5,
    pass_completion: 85.0,
    key_passes_per_90: 2.0,
    dribbles_per_90: 2.5,
    tackles_per_90: 1.0,
    interceptions_per_90: 0.5,
    aerial_duels_won: 50.0
  },
  playing_style: `Talented ${p.pos} with great potential.`,
  strengths: ["Technical", "Vision", "Pace"],
  weaknesses: ["Consistency"],
  recent_matches: [
    { date: "2024-11-23", opponent: "Test Team", result: "W 2-1", minutes: 90, goals: 1, assists: 1, rating: 8.0 }
  ],
  transfer_history: [
    { date: "2020-01-01", from: "Youth Team", to: p.team, fee: "€10M", type: "Transfer" }
  ],
  trophies: [
    { title: "League Title", season: "2023/24", competition: "League" }
  ]
}));

// Combine with existing players
const allPlayers = [...existingPlayers, ...newPlayers];

// Write to file
writeFileSync(join(__dirname, 'players.json'), JSON.stringify(allPlayers, null, 2));

console.log(`✅ Added ${newPlayers.length} new players`);
console.log(`📊 Total players now: ${allPlayers.length}`);
