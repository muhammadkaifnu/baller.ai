import mongoose from 'mongoose'

const playerSchema = new mongoose.Schema({
  player_id: { type: String, required: true, unique: true },
  basic_info: {
    name: { type: String, required: true },
    full_name: String,
    age: Number,
    date_of_birth: String,
    nationality: String,
    position: String,
    preferred_foot: String,
    height: String,
    weight: String,
    image: String
  },
  current_club: {
    name: String,
    position: String,
    jersey_number: Number,
    joined_date: String,
    contract_until: String,
    market_value: String
  },
  fifa_ratings: {
    overall: Number,
    potential: Number,
    pace: Number,
    shooting: Number,
    passing: Number,
    dribbling: Number,
    defending: Number,
    physical: Number
  },
  season_stats: {
    season: String,
    appearances: Number,
    goals: Number,
    assists: Number,
    minutes_played: Number,
    goals_per_90: Number,
    assists_per_90: Number,
    yellow_cards: Number,
    red_cards: Number
  },
  advanced_stats: {
    xG: Number,
    xA: Number,
    pass_completion: Number,
    key_passes_per_90: Number,
    dribbles_per_90: Number,
    tackles_per_90: Number,
    interceptions_per_90: Number,
    aerial_duels_won: Number
  },
  playing_style: String,
  strengths: [String],
  weaknesses: [String],
  recent_matches: [{
    date: String,
    opponent: String,
    result: String,
    minutes: Number,
    goals: Number,
    assists: Number,
    rating: Number
  }],
  transfer_history: [{
    date: String,
    from: String,
    to: String,
    fee: String,
    type: String
  }],
  trophies: [{
    title: String,
    season: String,
    competition: String
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

playerSchema.index({ 'basic_info.name': 'text' })

export default mongoose.model('Player', playerSchema)
