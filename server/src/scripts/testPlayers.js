import mongoose from 'mongoose'
import Player from '../models/Player.js'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://muhammadkaifnu_db_user:dd7499a8@cluster0.eybpzsa.mongodb.net/football?retryWrites=true&w=majority'

async function testPlayers() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tlsAllowInvalidCertificates: true
    })
    console.log('✓ MongoDB connected')

    // Count total players
    const count = await Player.countDocuments()
    console.log(`\n📊 Total players in database: ${count}`)

    // List all players
    const players = await Player.find({}).select('player_id basic_info.name current_club.name').lean()
    
    console.log('\n👥 Players in database:')
    players.forEach((player, idx) => {
      console.log(`${idx + 1}. ${player.basic_info.name} (${player.current_club.name}) - ID: ${player.player_id}`)
    })

    // Test search
    console.log('\n🔍 Testing search for "haaland":')
    const searchResults = await Player.find({
      $or: [
        { 'basic_info.name': { $regex: 'haaland', $options: 'i' } },
        { 'basic_info.full_name': { $regex: 'haaland', $options: 'i' } }
      ]
    }).select('player_id basic_info.name').lean()
    
    console.log(`Found ${searchResults.length} results:`)
    searchResults.forEach(p => console.log(`  - ${p.basic_info.name}`))

    process.exit(0)
  } catch (error) {
    console.error('✗ Error:', error)
    process.exit(1)
  }
}

testPlayers()
