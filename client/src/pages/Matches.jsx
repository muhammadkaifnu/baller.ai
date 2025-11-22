import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTeamLogo } from '../utils/teamLogos'
import MatchModal from '../components/MatchModal'

export default function Matches() {
  const { token } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedMatch, setSelectedMatch] = useState(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/matches?limit=100', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        setMatches(data.data?.matches || [])
      } catch (error) {
        console.error('Error fetching matches:', error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchMatches()

      // Auto-refresh every 30 seconds to get live updates
      const intervalId = setInterval(() => {
        fetchMatches()
      }, 30000) // 30 seconds

      // Cleanup interval on unmount
      return () => clearInterval(intervalId)
    }
  }, [token])

  // Helper functions
  const getMatchDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0]
  }

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const getYesterdayDate = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString)
    const today = getTodayDate()
    const yesterday = getYesterdayDate()
    const tomorrow = getTomorrowDate()

    if (dateString === today) return 'Today'
    if (dateString === yesterday) return 'Yesterday'
    if (dateString === tomorrow) return 'Tomorrow'

    // Format as "Mon 24" or "20 Nov"
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })

    // If within next 7 days, show day name
    const diffDays = Math.floor((date - new Date()) / (1000 * 60 * 60 * 24))
    if (diffDays >= 0 && diffDays <= 7) {
      return `${dayName} ${day}`
    }

    return `${day} ${month}`
  }

  // Get all unique dates and sort them
  const getAllDates = () => {
    const dateSet = new Set()
    matches.forEach(match => {
      dateSet.add(getMatchDate(match.date))
    })
    return Array.from(dateSet).sort()
  }

  const allDates = getAllDates()

  // Set default selected date to today or first available date
  useEffect(() => {
    if (allDates.length > 0 && !selectedDate) {
      const today = getTodayDate()
      if (allDates.includes(today)) {
        setSelectedDate(today)
      } else {
        // Find closest date to today
        const todayTime = new Date(today).getTime()
        const closest = allDates.reduce((prev, curr) => {
          const prevDiff = Math.abs(new Date(prev).getTime() - todayTime)
          const currDiff = Math.abs(new Date(curr).getTime() - todayTime)
          return currDiff < prevDiff ? curr : prev
        })
        setSelectedDate(closest)
      }
    }
  }, [allDates.length])

  // Get matches for selected date
  const getMatchesForDate = (date) => {
    return matches.filter(m => getMatchDate(m.date) === date)
  }

  const displayMatches = selectedDate ? getMatchesForDate(selectedDate) : []

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading matches...</div>
      </div>
    )
  }

  return (
    <div className="text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Matches
        </h1>
        <p className="text-slate-400">Live scores and upcoming fixtures</p>
      </div>

      {/* Date Tabs - Horizontal Scrollable */}
      <div className="mb-6 -mx-6 px-6">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {allDates.map(date => {
            const label = formatDateLabel(date)
            const isToday = date === getTodayDate()
            const isSelected = date === selectedDate
            const matchCount = getMatchesForDate(date).length

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center min-w-[100px] px-4 py-3 rounded-lg transition-all whitespace-nowrap ${isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
              >
                <span className={`text-lg font-bold ${isToday && !isSelected ? 'text-cyan-400' : ''}`}>
                  {label}
                </span>
                <span className="text-xs mt-1 opacity-75">
                  {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Matches Count */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-300">
          {selectedDate && `${formatDateLabel(selectedDate)}'s Matches (${displayMatches.length})`}
        </h2>
      </div>

      {/* Matches Grouped by League */}
      {displayMatches.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No matches found for this date</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Group matches by league */}
          {['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'].map(leagueName => {
            const leagueMatches = displayMatches.filter(m => m.league === leagueName)

            if (leagueMatches.length === 0) return null

            return (
              <div key={leagueName} className="space-y-4">
                {/* League Header */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-white">{leagueName}</h3>
                  <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-semibold rounded-full">
                    {leagueMatches.length} {leagueMatches.length === 1 ? 'match' : 'matches'}
                  </span>
                </div>

                {/* League Matches Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {leagueMatches.map((match, idx) => (
                    <MatchCard
                      key={idx}
                      match={match}
                      onClick={() => setSelectedMatch(match)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Match Modal */}
      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

function MatchCard({ match, onClick }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const getStatusLabel = () => {
    if (match.status === 'live') {
      return <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">● LIVE</span>
    }
    if (match.status === 'finished') {
      return <span className="text-slate-400 text-xs font-semibold uppercase">Full Time</span>
    }
    return <span className="text-cyan-400 text-sm font-semibold">{formatTime(match.date)}</span>
  }

  // Only show scores for live and finished matches
  const showScore = match.status === 'finished' || match.status === 'live'

  return (
    <div
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-cyan-500/50 hover:bg-slate-800 transition-all cursor-pointer backdrop-blur-sm"
      onClick={onClick}
    >
      {/* Header with League and Status/Time */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 text-xs uppercase font-semibold tracking-wider">{match.league}</span>
        {getStatusLabel()}
      </div>

      {/* Match Teams and Score - Horizontal Layout */}
      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={match.home_logo || getTeamLogo(match.home_team)}
            alt={match.home_team}
            className="w-10 h-10 object-contain flex-shrink-0"
            onError={(e) => { e.target.src = getTeamLogo(match.home_team) }}
          />
          <span className="text-slate-200 font-medium text-sm truncate">{match.home_team}</span>
        </div>

        {/* Score or VS */}
        <div className="flex items-center gap-3 px-4">
          {showScore ? (
            <>
              <span className="text-white text-2xl font-bold min-w-[20px] text-center">
                {match.home_score ?? 0}
              </span>
              <span className="text-slate-600 text-xl font-bold">-</span>
              <span className="text-white text-2xl font-bold min-w-[20px] text-center">
                {match.away_score ?? 0}
              </span>
            </>
          ) : (
            <span className="text-slate-500 font-semibold text-sm px-2">VS</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <span className="text-slate-200 font-medium text-sm truncate text-right">{match.away_team}</span>
          <img
            src={match.away_logo || getTeamLogo(match.away_team)}
            alt={match.away_team}
            className="w-10 h-10 object-contain flex-shrink-0"
            onError={(e) => { e.target.src = getTeamLogo(match.away_team) }}
          />
        </div>
      </div>
    </div>
  )
}
