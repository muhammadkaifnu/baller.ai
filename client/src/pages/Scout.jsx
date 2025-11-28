import { useState, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown, Trophy, Activity, Calendar, Shirt, Award, ChevronLeft, Star } from 'lucide-react'

function TrendingPlayers({ onPlayerClick }) {
  const [trendingPlayers, setTrendingPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const token = localStorage.getItem('token')
        // Fetch top players sorted by goals
        const response = await fetch('http://localhost:5001/api/players?limit=6&sort=goals', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        if (data.success) {
          setTrendingPlayers(data.data.players || [])
        }
      } catch (error) {
        console.error('Error fetching trending players:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-3 mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Trending Players
        </h2>
      </div>

      {trendingPlayers.map((player, idx) => (
        <div
          key={idx}
          onClick={() => onPlayerClick(player.player_id)}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-20 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition"></div>

          <div className="relative z-10 flex items-center gap-4">
            <img 
              src={player.basic_info?.image || 'https://via.placeholder.com/150'} 
              alt={player.basic_info?.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 group-hover:border-cyan-500 transition bg-slate-900" 
            />
            <div>
              <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition">
                {player.basic_info?.name}
              </h3>
              <p className="text-slate-400">{player.current_club?.name}</p>
            </div>
            <div className="ml-auto bg-slate-900 rounded-lg px-3 py-1 border border-slate-700">
              <span className="text-cyan-400 font-bold">{player.fifa_ratings?.overall || 75}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Scout() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchLoading, setSearchLoading] = useState(false)

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 0) {
        setSearchLoading(true)
        try {
          const token = localStorage.getItem('token')
          console.log('🔍 Searching for:', searchTerm)
          console.log('🔑 Token:', token ? 'Present' : 'Missing')
          
          const response = await fetch(`http://localhost:5001/api/players/search?query=${searchTerm}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          console.log('📡 Response status:', response.status)
          const data = await response.json()
          console.log('📦 Response data:', data)
          
          if (data.success) {
            setSearchResults(data.data)
            console.log('✅ Found', data.data.length, 'players')
          } else {
            console.error('❌ Search failed:', data.error)
          }
        } catch (error) {
          console.error('❌ Error searching players:', error)
        } finally {
          setSearchLoading(false)
        }
      } else {
        setSearchResults([])
      }
    }, 100) // Reduced to 100ms for instant feel

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  // Helper to highlight matching text
  const HighlightMatch = ({ text, highlight }) => {
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, 'gi')
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? <span key={i} className="text-cyan-400 font-bold">{part}</span> : <span key={i}>{part}</span>
        )}
      </span>
    )
  }

  const fetchPlayerDetails = async (playerId) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/players/${playerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setSelectedPlayer(data.data)
      }
    } catch (error) {
      console.error('Error fetching player details:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderOverview = (player) => (
    <div className="space-y-6">
      {/* FIFA Card & Basic Info */}
      <div className="grid grid-cols-3 gap-6">
        {/* FIFA Style Card */}
        <div className="bg-gradient-to-b from-yellow-600/20 to-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 relative overflow-hidden group hover:border-yellow-500/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="w-32 h-32" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="text-4xl font-bold text-yellow-400 mb-1">{player.fifa_ratings.overall}</div>
            <div className="text-xs text-yellow-500/80 uppercase tracking-widest mb-4">{player.basic_info.position}</div>

            <div className="w-24 h-24 rounded-full border-2 border-yellow-500/30 overflow-hidden mb-4 bg-slate-900">
              <img src={player.basic_info.image} alt={player.basic_info.name} className="w-full h-full object-cover" />
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-1">{player.basic_info.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
              <img src={`https://flagcdn.com/w20/${getCountryCode(player.basic_info.nationality)}.png`} alt={player.basic_info.nationality} className="w-5" />
              <span>{player.basic_info.nationality}</span>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full px-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm font-medium">PAC</span>
                <span className={`font-bold ${getRatingColor(player.fifa_ratings.pace)}`}>{player.fifa_ratings.pace}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm font-medium">DRI</span>
                <span className={`font-bold ${getRatingColor(player.fifa_ratings.dribbling)}`}>{player.fifa_ratings.dribbling}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm font-medium">SHO</span>
                <span className={`font-bold ${getRatingColor(player.fifa_ratings.shooting)}`}>{player.fifa_ratings.shooting}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm font-medium">DEF</span>
                <span className={`font-bold ${getRatingColor(player.fifa_ratings.defending)}`}>{player.fifa_ratings.defending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm font-medium">PAS</span>
                <span className={`font-bold ${getRatingColor(player.fifa_ratings.passing)}`}>{player.fifa_ratings.passing}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm font-medium">PHY</span>
                <span className={`font-bold ${getRatingColor(player.fifa_ratings.physical)}`}>{player.fifa_ratings.physical}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats & Market Value */}
        <div className="col-span-2 space-y-6">
          {/* Market Value Widget */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-4">Market Value</h3>
            <div className="flex items-end gap-4">
              <div className="text-4xl font-bold text-white">{player.current_club.market_value}</div>
              <div className="flex items-center gap-1 text-green-400 mb-1.5 bg-green-400/10 px-2 py-0.5 rounded">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-bold">+12%</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-2">Updated: Nov 28, 2025</p>
          </div>

          {/* Season Stats Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{player.season_stats.goals}</div>
              <div className="text-xs text-slate-400 uppercase">Goals</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{player.season_stats.assists}</div>
              <div className="text-xs text-slate-400 uppercase">Assists</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{player.season_stats.appearances}</div>
              <div className="text-xs text-slate-400 uppercase">Apps</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{player.season_stats.goals_per_90}</div>
              <div className="text-xs text-slate-400 uppercase">G/90</div>
            </div>
          </div>

          {/* Playing Style */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-3">Playing Style</h3>
            <p className="text-slate-300 leading-relaxed">{player.playing_style}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {player.strengths.map((strength, idx) => (
                <span key={idx} className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">
                  + {strength}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStats = (player) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Advanced Stats */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            Advanced Metrics
          </h3>
          <div className="space-y-4">
            {Object.entries(player.advanced_stats).map(([key, value], idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-slate-700/50 pb-3 last:border-0">
                <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-white font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Season Heatmap Placeholder */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-full h-48 bg-slate-900/50 rounded-lg mb-4 flex items-center justify-center border border-slate-700/50 border-dashed">
            <span className="text-slate-500">Season Heatmap Visualization</span>
          </div>
          <p className="text-slate-400 text-sm">Heatmap data requires premium subscription</p>
        </div>
      </div>
    </div>
  )

  const renderMatches = (player) => (
    <div className="space-y-4">
      {player.recent_matches.map((match, idx) => (
        <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:bg-slate-800 transition cursor-pointer">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-12 rounded-full ${match.result.startsWith('W') ? 'bg-green-500' :
              match.result.startsWith('D') ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
            <div>
              <div className="text-slate-400 text-xs mb-1">{match.date}</div>
              <div className="text-white font-bold flex items-center gap-2">
                vs {match.opponent}
                <span className={`text-xs px-1.5 py-0.5 rounded ${match.result.startsWith('W') ? 'bg-green-500/20 text-green-400' :
                  match.result.startsWith('D') ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>{match.result}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-slate-500 uppercase">Mins</div>
              <div className="text-white font-bold">{match.minutes}'</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 uppercase">Goals</div>
              <div className="text-white font-bold">{match.goals}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 uppercase">Rating</div>
              <div className={`font-bold ${getRatingColor(match.rating * 10)}`}>{match.rating}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderHistory = (player) => (
    <div className="space-y-8">
      {/* Transfer History */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Transfer History
        </h3>
        <div className="space-y-3">
          {player.transfer_history.map((transfer, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-slate-400 text-sm">{transfer.date.split('-')[0]}</div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{transfer.from}</span>
                  <ChevronLeft className="w-4 h-4 text-slate-500 rotate-180" />
                  <span className="text-white font-medium">{transfer.to}</span>
                </div>
              </div>
              <div className="text-green-400 font-bold">{transfer.fee}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trophies */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Trophy Cabinet
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {player.trophies.map((trophy, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col items-center text-center hover:border-yellow-500/50 transition">
              <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
              <div className="text-white font-bold text-sm mb-1">{trophy.title}</div>
              <div className="text-slate-500 text-xs">{trophy.season}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Helper functions
  const getRatingColor = (rating) => {
    if (rating >= 90) return 'text-green-400'
    if (rating >= 80) return 'text-cyan-400'
    if (rating >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getCountryCode = (nationality) => {
    // Simple mapping for demo - in production use a proper library
    const map = { 'Norway': 'no', 'England': 'gb-eng', 'France': 'fr', 'Brazil': 'br', 'Spain': 'es' }
    return map[nationality] || 'un'
  }

  if (selectedPlayer) {
    return (
      <div className="pb-8 px-8">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPlayer(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Search
        </button>

        {/* Player Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{selectedPlayer.basic_info.name}</h1>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <Shirt className="w-4 h-4" />
                {selectedPlayer.current_club.name}
              </span>
              <span>•</span>
              <span>{selectedPlayer.current_club.position}</span>
              <span>•</span>
              <span>{selectedPlayer.basic_info.age} years</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-cyan-500 text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-cyan-400 transition">
              Follow
            </button>
            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 transition border border-slate-700">
              Compare
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-slate-700 mb-8">
          {['overview', 'stats', 'matches', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition relative ${activeTab === tab ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-300'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {activeTab === 'overview' && renderOverview(selectedPlayer)}
          {activeTab === 'stats' && renderStats(selectedPlayer)}
          {activeTab === 'matches' && renderMatches(selectedPlayer)}
          {activeTab === 'history' && renderHistory(selectedPlayer)}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-8 px-8 min-h-screen">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center mb-12 pt-12">
        <h1 className="text-5xl font-bold text-white mb-4">Scout Hub</h1>
        <p className="text-slate-400 text-lg mb-8">Discover the next generation of football talent with AI-powered analytics.</p>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-500" />
          <input
            type="text"
            placeholder="Search for players (e.g. Haaland, Bellingham)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-14 pr-4 py-4 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-xl backdrop-blur-sm"
          />
          {searchLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500"></div>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute mt-2 w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 text-left">
            {searchResults.map((player) => (
              <div
                key={player.id}
                onClick={() => fetchPlayerDetails(player.id)}
                className="p-4 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700/50 last:border-0 flex items-center gap-4 transition"
              >
                <img src={player.image} alt={player.name} className="w-12 h-12 rounded-full object-cover bg-slate-900" />
                <div>
                  <div className="text-white font-bold">
                    <HighlightMatch text={player.name} highlight={searchTerm} />
                  </div>
                  <div className="text-slate-400 text-sm">{player.team} • {player.position}</div>
                </div>
                <div className="ml-auto">
                  <ChevronLeft className="w-5 h-5 text-slate-500 rotate-180" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured/Trending Section (when not searching) */}
      {!selectedPlayer && <TrendingPlayers onPlayerClick={fetchPlayerDetails} />}
    </div>
  )
}
