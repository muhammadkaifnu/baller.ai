import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import matchesRoutes from './routes/matches.js'
import adminRoutes from './routes/admin.js'
import newsRoutes from './routes/news.js'
import playersRoutes from './routes/players.js'
import statsRoutes from './routes/stats.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://muhammadkaifnu_db_user:dd7499a8@cluster0.eybpzsa.mongodb.net/football?retryWrites=true&w=majority'

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  tlsAllowInvalidCertificates: true // For development on macOS
})
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('✗ MongoDB connection error:', err))

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() })
})

// API Root
app.get('/api', (req, res) => {
  res.json({ message: 'Football Hub Server API' })
})

// Routes
app.use('/auth', authRoutes)
app.use('/api/matches', matchesRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/players', playersRoutes)
app.use('/api/stats', statsRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`)
})
