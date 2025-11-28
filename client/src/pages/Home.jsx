import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Trophy, Users, Flame, Newspaper } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getTeamLogo } from '../utils/teamLogos'
import MatchModal from '../components/MatchModal'

export default function Home() {
  const { token, logout } = useAuth()
  const [matches, setMatches] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [newsLoading, setNewsLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState(null)

  // Define top teams from major leagues
  const topTeams = [
    // Premier League
    'Manchester City', 'Arsenal', 'Liverpool', 'Manchester United', 'Chelsea', 'Tottenham', 'Newcastle',
    // La Liga
    'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla',
    // Serie A
    'Inter Milan', 'AC Milan', 'Juventus', 'Napoli', 'Roma',
    // Bundesliga
    'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen',
    // Ligue 1
    'Paris Saint-Germain', 'Monaco', 'Marseille', 'Lyon'
  ]

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/matches?limit=100', {
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
        const allMatches = data.data?.matches || []

        // Filter matches to show only top teams
        const topTeamMatches = allMatches.filter(match =>
          topTeams.includes(match.home_team) || topTeams.includes(match.away_team)
        )

        setMatches(topTeamMatches)
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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/news')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setNews(data.data || [])
      } catch (error) {
        console.error('Error fetching news:', error)
        // Set fallback news on error
        setNews([
          { tag: 'BREAKING', title: 'Unable to load live news', time: 'Just now', source: 'System' },
        ])
      } finally {
        setNewsLoading(false)
      }
    }

    fetchNews()
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

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
            <div key={idx} className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Background Team Logo */}
              <div className="absolute -top-1 -right-1 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <img src={getTeamLogo(scorer.team)} alt={scorer.team} className="w-12 h-12 object-contain rotate-12" />
              </div>

              {/* Player Image */}
              <div className="relative mb-1.5 w-10 h-10 mx-auto rounded-full overflow-hidden border-2 border-slate-700/50 group-hover:border-yellow-500/50 transition-all duration-300 shadow-md">
                <img
                  src={scorer.image}
                  alt={scorer.player}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => { e.target.src = getTeamLogo(scorer.team) }}
                />
              </div>

              {/* Player Info */}
              <h3 className="text-white font-semibold text-[11px] truncate text-center mb-0.5">{scorer.player}</h3>
              <p className="text-slate-400 text-[9px] text-center mb-1.5 truncate">{scorer.team}</p>

              {/* Goals Badge */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-md px-1.5 py-0.5 text-center">
                <span className="text-yellow-400 font-bold text-[11px]">{scorer.goals}</span>
                <span className="text-yellow-500/70 text-[9px] ml-1">Goals</span>
              </div>

              {/* League Tag */}
              <div className="mt-1.5 text-center">
                <span className="text-slate-500 text-[8px] uppercase tracking-wider">{scorer.league}</span>
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
            <div key={idx} className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Background Team Logo */}
              <div className="absolute -top-1 -right-1 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <img src={getTeamLogo(player.team)} alt={player.team} className="w-12 h-12 object-contain rotate-12" />
              </div>

              {/* Player Image */}
              <div className="relative mb-1.5 w-10 h-10 mx-auto rounded-full overflow-hidden border-2 border-slate-700/50 group-hover:border-cyan-500/50 transition-all duration-300 shadow-md">
                <img
                  src={player.image}
                  alt={player.player}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => { e.target.src = getTeamLogo(player.team) }}
                />
              </div>

              {/* Player Info */}
              <h3 className="text-white font-semibold text-[11px] truncate text-center mb-0.5">{player.player}</h3>
              <p className="text-slate-400 text-[9px] text-center mb-1.5 truncate">{player.team}</p>

              {/* Assists Badge */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-md px-1.5 py-0.5 text-center">
                <span className="text-cyan-400 font-bold text-[11px]">{player.assists}</span>
                <span className="text-cyan-500/70 text-[9px] ml-1">Assists</span>
              </div>

              {/* League Tag */}
              <div className="mt-1.5 text-center">
                <span className="text-slate-500 text-[8px] uppercase tracking-wider">{player.league}</span>
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
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Top Teams Matches</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-slate-400">Loading matches...</div>
            ) : matches.length > 0 ? (
              matches.slice(0, 10).map((match, idx) => (
                <MatchCard key={idx} match={match} onClick={() => setSelectedMatch(match)} />
              ))
            ) : (
              <div className="text-center text-slate-400">No matches available</div>
            )}
          </div>
        </div>

        {/* Latest News - 1 column */}
        <div>
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-emerald-500" />
            Latest News
            {newsLoading && <span className="text-xs text-slate-500 normal-case">(Loading...)</span>}
          </h2>
          <div className="space-y-3">
            {newsLoading ? (
              <div className="text-center text-slate-400 py-8">
                <div className="animate-pulse">Loading latest news...</div>
              </div>
            ) : news.length > 0 ? (
              news.slice(0, 10).map((item, idx) => (
                <Link
                  key={idx}
                  to={`/news/${idx}`}
                  className="group block bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer overflow-hidden relative"
                >
                  {/* Background Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative">
                    {/* Tag */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.tag === 'BREAKING' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20' :
                        item.tag === 'TRANSFER' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20' :
                          item.tag === 'UCL' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' :
                            item.tag === 'EPL' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20' :
                              item.tag === 'INJURY' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 shadow-lg shadow-yellow-500/20' :
                                item.tag === 'MANAGER' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20' :
                                  item.tag === 'MATCH' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20' :
                                    'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/20'
                        }`}>
                        {item.tag}
                      </span>

                      {/* Source Badge */}
                      {item.source && (
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                          {item.source}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <p className="text-slate-200 text-sm leading-snug mb-2 group-hover:text-white transition-colors duration-300 font-medium">
                      {item.title}
                    </p>

                    {/* Time */}
                    <div className="flex items-center justify-between">
                      <p className="text-slate-500 text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.time}
                      </p>

                      {/* Arrow Icon for internal link */}
                      <svg className="w-3 h-3 text-slate-600 group-hover:text-emerald-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8">
                No news available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Match Modal */}
      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  )
}

function MatchCard({ match, onClick }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const getStatusLabel = () => {
    if (match.status === 'live') {
      return <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded animate-pulse">● LIVE</span>
    }
    if (match.status === 'finished') {
      return <span className="text-slate-400 text-xs font-semibold uppercase">Full Time</span>
    }
    return <span className="text-cyan-400 text-sm font-semibold">{formatDate(match.date)}</span>
  }

  // Only show scores for live and finished matches
  const showScore = match.status === 'finished' || match.status === 'live'
  const isLive = match.status === 'live'

  return (
    <div
      onClick={onClick}
      className={`bg-slate-800/50 border rounded-xl p-5 hover:bg-slate-800 transition-all cursor-pointer backdrop-blur-sm ${isLive
        ? 'border-red-500/50 hover:border-red-500 shadow-lg shadow-red-500/20'
        : 'border-slate-700/50 hover:border-cyan-500/50'
        }`}>
      {/* Header with League and Status/Time */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 text-xs uppercase font-semibold tracking-wider">{match.league}</span>
        {getStatusLabel()}
      </div>

      {/* Match Teams and Score - Horizontal Layout */}
      <div className="flex items-center justify-between gap-4 mb-4">
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

      {/* AI Win Probability - Only show for scheduled matches */}
      {!showScore && (
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
      )}
    </div>
  )
}
