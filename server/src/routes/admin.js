import express from 'express'
import axios from 'axios'
import { adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000'

// POST /api/admin/refresh-data - Trigger data refresh from AI Engine
router.post('/refresh-data', adminMiddleware, async (req, res) => {
  try {
    console.log('📡 Sending refresh request to AI Engine...')

    // Send request to FastAPI service
    const response = await axios.get(`${AI_ENGINE_URL}/trigger-scrape`, {
      timeout: 5000 // 5 second timeout for the initial request
    })

    res.json({
      success: true,
      message: 'Data refresh triggered successfully',
      aiEngineResponse: response.data,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Error triggering data refresh:', error.message)

    // Return appropriate error response
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'AI Engine service unavailable',
        message: 'Could not connect to the AI Engine service'
      })
    }

    if (error.response) {
      return res.status(error.response.status).json({
        error: 'AI Engine error',
        message: error.response.data?.message || 'Failed to trigger data refresh'
      })
    }

    res.status(500).json({
      error: 'Failed to trigger data refresh',
      message: error.message
    })
  }
})

// GET /api/admin/status - Check AI Engine status
router.get('/status', adminMiddleware, async (req, res) => {
  try {
    const response = await axios.get(`${AI_ENGINE_URL}/health`, {
      timeout: 5000
    })

    res.json({
      success: true,
      aiEngine: response.data,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Error checking AI Engine status:', error.message)

    res.status(503).json({
      success: false,
      error: 'AI Engine unavailable',
      timestamp: new Date()
    })
  }
})

export default router
