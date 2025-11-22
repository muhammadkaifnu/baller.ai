import { useState, useEffect } from 'react'
import { TrendingUp, Trophy, Users, Flame } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getTeamLogo } from '../utils/teamLogos'

export default function Dashboard() {
  const { token } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/matches?limit=10', {
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
    }
  }, [token])

  const hotPredictions = [
    { icon: '🔥', percentage: 78, title: 'Over 2.5 Goals', match: 'Man City vs Arsenal' },
    { icon: '🔥', percentage: 82, title: 'BTTS Yes', match: 'Liverpool vs Chelsea' },
    { icon: '🔥', percentage: 64, title: 'Away Win', match: 'Tottenham vs Man Utd' },
    { icon: '🔥', percentage: 71, title: 'Under 3.5', match: 'Bayern vs Dortmund' },
  ]

  const stats = [
    { icon: TrendingUp, label: 'Total Predictions', value: '168', change: '+12', color: 'cyan' },
    { icon: Trophy, label: 'Accuracy Rate', value: '85%', change: '+3%', color: 'green' },
    { icon: Users, label: 'Active Leagues', value: '8', change: '+2', color: 'purple' }
  ]

  return (
    <div className="pb-8 px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-1">Dashboard</h1>
        <p className="text-slate-400 text-sm">AI-powered football analytics and predictions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          const borderColor = stat.color === 'cyan' ? 'border-cyan-500' : stat.color === 'green' ? 'border-green-500' : 'border-purple-500'
          const textColor = stat.color === 'cyan' ? 'text-cyan-400' : stat.color === 'green' ? 'text-green-400' : 'text-purple-400'

          return (
            <div key={idx} className={`bg-slate-800 border ${borderColor} border-opacity-30 rounded-xl p-6`}>
              <div className="flex items-start justify-between mb-4">
                <Icon className={`w-6 h-6 ${textColor}`} />
                <span className={`text-xs font-semibold ${textColor}`}>{stat.change}</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-slate-400 text-xs uppercase">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Featured Matches - 2 columns */}
        <div className="col-span-2">
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Featured Matches</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-slate-400">Loading matches...</div>
            ) : matches.length > 0 ? (
              matches.slice(0, 3).map((match, idx) => (
                <MatchCard key={idx} match={match} />
              ))
            ) : (
              <div className="text-center text-slate-400">No matches available</div>
            )}
          </div>
        </div>

        {/* Latest News - 1 column */}
        <div>
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Latest News</h2>
          <div className="space-y-3">
            {[
              { tag: 'BREAKING', title: 'Haaland breaks Premier League scoring record', time: '2h ago' },
              { tag: 'TRANSFER', title: 'Messi extends contract with Inter Miami', time: '5h ago' },
              { tag: 'UCL', title: 'Champions League draw announced', time: '8h ago' },
              { tag: 'INJURY', title: 'Key player ruled out for 4 weeks', time: '1h ago' }
            ].map((news, idx) => (
              <div key={idx} className="bg-slate-800 rounded-lg p-3 hover:bg-slate-700 transition cursor-pointer">
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-1 ${news.tag === 'BREAKING' ? 'bg-red-500 text-white' :
                  news.tag === 'TRANSFER' ? 'bg-cyan-500 text-slate-900' :
                    news.tag === 'UCL' ? 'bg-cyan-600 text-white' :
                      'bg-yellow-600 text-white'
                  }`}>
                  {news.tag}
                </span>
                <p className="text-slate-300 text-xs leading-tight">{news.title}</p>
                <p className="text-slate-500 text-xs mt-1">{news.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hot Predictions */}
      <div className="mt-12">
        <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-5 h-5 text-purple-400" />
          Hot Predictions
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {hotPredictions.map((pred, idx) => (
            <div key={idx} className="bg-gradient-to-br from-purple-900 to-purple-800 border border-purple-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{pred.icon}</span>
                <span className="text-purple-400 font-bold text-lg">{pred.percentage}%</span>
              </div>
              <p className="text-white text-sm font-semibold mb-1">{pred.title}</p>
              <p className="text-slate-400 text-xs">{pred.match}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MatchCard({ match }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-cyan-500 transition">
      {/* Header with Time and League */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 text-xs uppercase">{match.league}</span>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs font-bold rounded">TODAY</span>
          <span className="text-cyan-400 text-sm font-semibold">{formatDate(match.date)}</span>
        </div>
      </div>

      {/* Match Teams */}
      <div className="flex items-center justify-between mb-4">
        {/* Home Team */}
        <div className="flex items-center gap-2 flex-1">
          <img
            src={match.home_logo || getTeamLogo(match.home_team)}
            alt={match.home_team}
            className="w-10 h-10 object-contain"
            onError={(e) => { e.target.src = getTeamLogo(match.home_team) }}
          />
          <p className="text-slate-300 font-semibold text-sm">{match.home_team}</p>
        </div>

        {/* VS */}
        <div className="px-3 text-slate-400 text-xs font-semibold">VS</div>

        {/* Away Team */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <p className="text-slate-300 font-semibold text-sm">{match.away_team}</p>
          <img
            src={match.away_logo || getTeamLogo(match.away_team)}
            alt={match.away_team}
            className="w-10 h-10 object-contain"
            onError={(e) => { e.target.src = getTeamLogo(match.away_team) }}
          />
        </div>
      </div>

      {/* AI Win Probability */}
      <div className="bg-slate-900 rounded-lg p-3">
        <p className="text-slate-400 text-xs uppercase mb-2 font-semibold">AI Win Probability</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full" style={{ width: '58%' }}></div>
          </div>
          <span className="text-cyan-400 font-bold text-sm min-w-fit">58%</span>
          <span className="text-slate-500 text-sm min-w-fit">42%</span>
        </div>
      </div>
    </div>
  )
}
