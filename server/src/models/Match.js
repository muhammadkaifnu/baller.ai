import mongoose from 'mongoose'

const matchSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true
    },
    home_team: {
      type: String,
      required: true,
      index: true
    },
    away_team: {
      type: String,
      required: true,
      index: true
    },
    home_score: {
      type: Number,
      default: null
    },
    away_score: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'finished'],
      default: 'scheduled',
      index: true
    },
    season: {
      type: String,
      default: '2024/25'
    },
    league: {
      type: String,
      default: 'Premier League',
      index: true
    },
    lineups: {
      home: {
        starting_lineups: [{
          player: String,
          number: String,
          position: String,
          posx: String,
          posy: String
        }],
        substitutes: [{
          player: String,
          number: String,
          position: String,
          posx: String,
          posy: String
        }],
        coach: [{
          lineup_player: String,
          lineup_number: String,
          lineup_position: String
        }],
        missing_players: []
      },
      away: {
        starting_lineups: [{
          player: String,
          number: String,
          position: String,
          posx: String,
          posy: String
        }],
        substitutes: [{
          player: String,
          number: String,
          position: String,
          posx: String,
          posy: String
        }],
        coach: [{
          lineup_player: String,
          lineup_number: String,
          lineup_position: String
        }],
        missing_players: []
      }
    },
    statistics: [{
      type: String,
      home: String,
      away: String
    }],
    match_events: [{
      event_id: String,
      updateAt: String,
      type: String,
      minute: String,
      team: String,
      player: String,
      assist: String,
      card: String,
      comment: String
    }]
  },
  {
    timestamps: true
  }
)

// Compound index for efficient filtering
matchSchema.index({ date: 1, status: 1 })
matchSchema.index({ home_team: 1, away_team: 1, date: 1 })

export default mongoose.model('Match', matchSchema)
