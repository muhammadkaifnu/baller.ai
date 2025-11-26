import { useState, useEffect } from 'react'
import { TrendingUp, Trophy, Users, Flame } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getTeamLogo } from '../utils/teamLogos'

export default function Dashboard() {
  const { token, logout } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/matches?limit=10', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        // Handle 401 Unauthorized - token is invalid or expired
        if (response.status === 401) {
          console.error('Authentication failed - logging out')
          logout()
          return
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

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
  }, [token, logout])

  const hotPredictions = [
    { icon: '🔥', percentage: 78, title: 'Over 2.5 Goals', match: 'Man City vs Arsenal' },
    { icon: '🔥', percentage: 82, title: 'BTTS Yes', match: 'Liverpool vs Chelsea' },
    { icon: '🔥', percentage: 64, title: 'Away Win', match: 'Tottenham vs Man Utd' },
    { icon: '🔥', percentage: 71, title: 'Under 3.5', match: 'Bayern vs Dortmund' },
  ]

  const topScorers = [
    { league: 'Premier League', player: 'Erling Haaland', team: 'Manchester City', goals: 18, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png' },
    { league: 'La Liga', player: 'Jude Bellingham', team: 'Real Madrid', goals: 14, image: 'https://b.fssta.com/uploads/application/soccer/headshots/71310.vresize.350.350.medium.14.png' },
    { league: 'Bundesliga', player: 'Harry Kane', team: 'Bayern Munich', goals: 22, image: 'https://b.fssta.com/uploads/application/soccer/headshots/3960.vresize.350.350.medium.14.png' },
    { league: 'Serie A', player: 'Lautaro Martínez', team: 'Inter Milan', goals: 16, image: 'https://b.fssta.com/uploads/application/soccer/headshots/43089.vresize.350.350.medium.14.png' },
    { league: 'Ligue 1', player: 'Jonathan David', team: 'Lille', goals: 19, image: 'https://b.fssta.com/uploads/application/soccer/headshots/52084.vresize.350.350.medium.14.png' },
  ]

  const topAssisters = [
    { league: 'Premier League', player: 'Mohamed Salah', team: 'Liverpool', assists: 8, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png' },
    { league: 'La Liga', player: 'Lamine Yamal', team: 'Barcelona', assists: 9, image: 'https://b.fssta.com/uploads/application/soccer/headshots/118223.vresize.350.350.medium.14.png' },
    { league: 'Bundesliga', player: 'Leroy Sané', team: 'Bayern Munich', assists: 10, image: 'https://b.fssta.com/uploads/application/soccer/headshots/2271.vresize.350.350.medium.14.png' },
    { league: 'Serie A', player: 'Marcus Thuram', team: 'Inter Milan', assists: 9, image: 'https://b.fssta.com/uploads/application/soccer/headshots/45788.vresize.350.350.medium.14.png' },
    { league: 'Ligue 1', player: 'Ousmane Dembélé', team: 'Paris Saint-Germain', assists: 8, image: 'https://b.fssta.com/uploads/application/soccer/headshots/33404.vresize.350.350.medium.14.png' },
  ]

  const seasonPredictions = [
    { title: 'Golden Boot', player: 'Erling Haaland', probability: '85%', subtitle: 'Record breaking pace' },
    { title: "Ballon d'Or", player: 'Jude Bellingham', probability: '65%', subtitle: 'Leading the race' },
    { title: 'UCL Winner', player: 'Man City', probability: '45%', subtitle: 'Back to back?' },
    { title: 'Euro 2024', player: 'France', probability: '32%', subtitle: 'Favorites' },
  ]

  return (
    <div className="pb-8 px-8">
      {/* Top Goal Scorers */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Top Goal Scorers
        </h2>
        <div className="grid grid-cols-5 gap-3">
          {topScorers.map((scorer, idx) => (
            <div key={idx} className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Background Team Logo */}
              <div className="absolute -top-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <img src={getTeamLogo(scorer.team)} alt={scorer.team} className="w-16 h-16 object-contain rotate-12" />
              </div>

              {/* Player Image */}
              <div className="relative mb-2 w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-slate-700/50 group-hover:border-yellow-500/50 transition-all duration-300 shadow-md">
                <img
                  src={scorer.image}
                  alt={scorer.player}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => { e.target.src = getTeamLogo(scorer.team) }}
                />
              </div>

              {/* Player Info */}
              <h3 className="text-white font-semibold text-xs truncate text-center mb-0.5">{scorer.player}</h3>
              <p className="text-slate-400 text-[10px] text-center mb-2 truncate">{scorer.team}</p>

              {/* Goals Badge */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-md px-2 py-1 text-center">
                <span className="text-yellow-400 font-bold text-xs">{scorer.goals}</span>
                <span className="text-yellow-500/70 text-[10px] ml-1">Goals</span>
              </div>

              {/* League Tag */}
              <div className="mt-2 text-center">
                <span className="text-slate-500 text-[9px] uppercase tracking-wider">{scorer.league}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Assisters */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-500" />
          Top Assisters
        </h2>
        <div className="grid grid-cols-5 gap-3">
          {topAssisters.map((player, idx) => (
            <div key={idx} className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Background Team Logo */}
              <div className="absolute -top-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <img src={getTeamLogo(player.team)} alt={player.team} className="w-16 h-16 object-contain rotate-12" />
              </div>

              {/* Player Image */}
              <div className="relative mb-2 w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-slate-700/50 group-hover:border-cyan-500/50 transition-all duration-300 shadow-md">
                <img
                  src={player.image}
                  alt={player.player}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => { e.target.src = getTeamLogo(player.team) }}
                />
              </div>

              {/* Player Info */}
              <h3 className="text-white font-semibold text-xs truncate text-center mb-0.5">{player.player}</h3>
              <p className="text-slate-400 text-[10px] text-center mb-2 truncate">{player.team}</p>

              {/* Assists Badge */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-md px-2 py-1 text-center">
                <span className="text-cyan-400 font-bold text-xs">{player.assists}</span>
                <span className="text-cyan-500/70 text-[10px] ml-1">Assists</span>
              </div>

              {/* League Tag */}
              <div className="mt-2 text-center">
                <span className="text-slate-500 text-[9px] uppercase tracking-wider">{player.league}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Season Predictions */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-500" />
          Season Predictions
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {seasonPredictions.map((pred, idx) => (
            <div key={idx} className="group relative bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-400 text-[10px] font-bold uppercase tracking-wider">{pred.title}</span>
                  <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/30">{pred.probability}</span>
                </div>

                {/* Player/Team Name */}
                <h3 className="text-white font-bold text-sm mb-1 truncate">{pred.player}</h3>

                {/* Subtitle */}
                <p className="text-slate-400 text-[10px] truncate">{pred.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hot Predictions */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          Hot Predictions
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {hotPredictions.map((pred, idx) => (
            <div key={idx} className="group relative bg-gradient-to-br from-orange-900/30 via-red-900/20 to-slate-900/50 backdrop-blur-sm border border-orange-500/20 rounded-lg p-3 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Animated Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative">
                {/* Icon and Percentage */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">{pred.icon}</span>
                    <span className="text-orange-400 font-bold text-base">{pred.percentage}%</span>
                  </div>
                  <div className="w-8 h-1 bg-gradient-to-r from-orange-500/50 to-transparent rounded-full"></div>
                </div>

                {/* Prediction Title */}
                <p className="text-white text-xs font-semibold mb-1 truncate">{pred.title}</p>

                {/* Match */}
                <p className="text-slate-400 text-[10px] truncate">{pred.match}</p>
              </div>
            </div>
          ))}
        </div>
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
