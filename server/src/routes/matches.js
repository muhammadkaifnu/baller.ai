import express from 'express'
import Match from '../models/Match.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// GET /api/matches - Fetch matches with optional filtering
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, limit = 50, skip = 0, sort = 'date' } = req.query

    // Build filter query
    const filter = {}

    if (status) {
      const statusMap = {
        'upcoming': 'scheduled',
        'live': 'live',
        'finished': 'finished'
      }
      
      const mappedStatus = statusMap[status.toLowerCase()]
      if (mappedStatus) {
        filter.status = mappedStatus
      } else {
        return res.status(400).json({ error: 'Invalid status. Use: upcoming, live, or finished' })
      }
    }

    // Execute query with pagination and sorting
    const matches = await Match.find(filter)
      .sort({ [sort]: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean()

    // Get total count for pagination
    const total = await Match.countDocuments(filter)

    res.json({
      success: true,
      data: {
        matches,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: parseInt(skip) + parseInt(limit) < total
        }
      }
    })
  } catch (error) {
    console.error('Error fetching matches:', error)
    res.status(500).json({ error: 'Failed to fetch matches' })
  }
})

// GET /api/matches/:id - Fetch single match by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)

    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }

    res.json({
      success: true,
      data: match
    })
  } catch (error) {
    console.error('Error fetching match:', error)
    res.status(500).json({ error: 'Failed to fetch match' })
  }
})

// GET /api/matches/teams/:team - Fetch matches for a specific team
router.get('/teams/:team', authMiddleware, async (req, res) => {
  try {
    const { team } = req.params
    const { limit = 50, skip = 0 } = req.query

    const matches = await Match.find({
      $or: [
        { home_team: new RegExp(team, 'i') },
        { away_team: new RegExp(team, 'i') }
      ]
    })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean()

    const total = await Match.countDocuments({
      $or: [
        { home_team: new RegExp(team, 'i') },
        { away_team: new RegExp(team, 'i') }
      ]
    })

    res.json({
      success: true,
      data: {
        team,
        matches,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching team matches:', error)
    res.status(500).json({ error: 'Failed to fetch team matches' })
  }
})

export default router
