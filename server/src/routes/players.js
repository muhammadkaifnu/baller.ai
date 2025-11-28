import express from 'express'
import Player from '../models/Player.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// GET /api/players/search - Search players by name
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query
    console.log('🔍 Search request received:', query)

    if (!query || query.length < 2) {
      console.log('⚠️ Query too short or empty')
      return res.json({ success: true, data: [] })
    }

    const players = await Player.find({
      $or: [
        { 'basic_info.name': { $regex: query, $options: 'i' } },
        { 'basic_info.full_name': { $regex: query, $options: 'i' } }
      ]
    })
      .limit(10)
      .select('player_id basic_info.name basic_info.image current_club.name basic_info.position')
      .lean()

    console.log(`✅ Found ${players.length} players`)

    const results = players.map(p => ({
      id: p.player_id,
      name: p.basic_info.name,
      image: p.basic_info.image,
      team: p.current_club.name,
      position: p.basic_info.position
    }))

    res.json({ success: true, data: results })
  } catch (error) {
    console.error('❌ Error searching players:', error)
    res.status(500).json({ success: false, error: 'Failed to search players' })
  }
})

// GET /api/players/:id - Get player details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const player = await Player.findOne({ player_id: req.params.id }).lean()

    if (!player) {
      return res.status(404).json({ error: 'Player not found' })
    }

    res.json({ success: true, data: player })
  } catch (error) {
    console.error('Error fetching player:', error)
    res.status(500).json({ error: 'Failed to fetch player details' })
  }
})

// GET /api/players - Get all players with pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { limit = 20, skip = 0, position, nationality, sort = 'name' } = req.query

    const filter = {}
    if (position) filter['basic_info.position'] = position
    if (nationality) filter['basic_info.nationality'] = nationality

    // Determine sort field
    let sortField = {}
    if (sort === 'goals') {
      sortField = { 'season_stats.goals': -1 }
    } else if (sort === 'rating') {
      sortField = { 'fifa_ratings.overall': -1 }
    } else {
      sortField = { 'basic_info.name': 1 }
    }

    const players = await Player.find(filter)
      .sort(sortField)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('player_id basic_info current_club fifa_ratings season_stats')
      .lean()

    const total = await Player.countDocuments(filter)

    res.json({
      success: true,
      data: {
        players,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching players:', error)
    res.status(500).json({ error: 'Failed to fetch players' })
  }
})

export default router
