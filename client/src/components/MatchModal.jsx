import { useState } from 'react'
import { X, Zap, Users, BarChart3 } from 'lucide-react'
import { getTeamLogo } from '../utils/teamLogos'

export default function MatchModal({ match, onClose }) {
  const [activeTab, setActiveTab] = useState('analysis')

  if (!match) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get real prediction data or use defaults
  const prediction = match.prediction || {}
  const homeWinProb = prediction.home_win_probability || 33
  const drawProb = prediction.draw_probability || 34
  const awayWinProb = prediction.away_win_probability || 33

  // Get real lineups or show message
  const hasLineups = match.lineups && (match.lineups.home || match.lineups.away)

  // Get real statistics or show message
  const hasStats = match.statistics && match.statistics.length > 0

  // Generate AI analysis text
  const getAIAnalysis = () => {
    if (prediction.predicted_winner) {
      const winner = prediction.predicted_winner
      const confidence = prediction.confidence || 'Moderate'
      const homeElo = prediction.home_elo || 'N/A'
      const awayElo = prediction.away_elo || 'N/A'

      return `${winner} holds an advantage with ${Math.round(winner === match.home_team ? homeWinProb : awayWinProb)}% win probability based on recent form, head-to-head records, and ${winner === match.home_team ? 'home' : 'away'} advantage. 

**Confidence Level:** ${confidence}

**Team Ratings:**
- ${match.home_team}: ${homeElo} ELO
- ${match.away_team}: ${awayElo} ELO

The AI model predicts a competitive match with ${winner} having the statistical edge. Key factors include team form, player availability, and tactical matchups.`
    }

    return `This match is evenly balanced with both teams having similar chances. The AI analysis suggests a competitive encounter based on current form and historical data.`
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-cyan-400">{match.league}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Match Header */}
          <div className="flex items-center justify-between gap-8">
            {/* Home Team */}
            <div className="flex flex-col items-center flex-1">
              <img
                src={match.home_logo || getTeamLogo(match.home_team)}
                alt={match.home_team}
                className="w-24 h-24 object-contain mb-3"
                onError={(e) => { e.target.src = getTeamLogo(match.home_team) }}
              />
              <h3 className="text-xl font-bold text-white text-center">{match.home_team}</h3>
              <p className="text-slate-400 text-sm">Home</p>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center">
              {match.status === 'finished' || match.status === 'live' ? (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold text-cyan-400">{match.home_score ?? 0}</span>
                    <span className="text-3xl font-bold text-slate-600">-</span>
                    <span className="text-5xl font-bold text-cyan-400">{match.away_score ?? 0}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-2 uppercase">
                    {match.status === 'live' ? '● LIVE' : 'FULL TIME'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-4xl font-bold text-slate-500">VS</p>
                  <p className="text-slate-400 text-sm mt-2">{formatDate(match.date)}</p>
                </>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center flex-1">
              <img
                src={match.away_logo || getTeamLogo(match.away_team)}
                alt={match.away_team}
                className="w-24 h-24 object-contain mb-3"
                onError={(e) => { e.target.src = getTeamLogo(match.away_team) }}
              />
              <h3 className="text-xl font-bold text-white text-center">{match.away_team}</h3>
              <p className="text-slate-400 text-sm">Away</p>
            </div>
          </div>

          {/* Stadium */}
          {match.stadium && (
            <div className="text-center mt-4">
              <p className="text-slate-400 text-sm">{match.stadium}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-6">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${activeTab === 'analysis'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
          >
            <Zap className="w-4 h-4" />
            <span className="font-semibold">AI Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('lineups')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${activeTab === 'lineups'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
          >
            <Users className="w-4 h-4" />
            <span className="font-semibold">Lineups</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${activeTab === 'stats'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="font-semibold">Stats</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Win Probability */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">WIN PROBABILITY</h3>

                <div className="space-y-4">
                  {/* Home Win */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 font-medium">{match.home_team} Win</span>
                      <span className="text-cyan-400 font-bold">{Math.round(homeWinProb)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full transition-all duration-500"
                        style={{ width: `${homeWinProb}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Draw */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 font-medium">Draw</span>
                      <span className="text-slate-400 font-bold">{Math.round(drawProb)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-slate-500 h-full transition-all duration-500"
                        style={{ width: `${drawProb}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Away Win */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 font-medium">{match.away_team} Win</span>
                      <span className="text-purple-400 font-bold">{Math.round(awayWinProb)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-400 h-full transition-all duration-500"
                        style={{ width: `${awayWinProb}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Text */}
              <div className="bg-slate-800/50 rounded-xl p-6 border-l-4 border-cyan-500">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-cyan-400">AI ANALYSIS</h3>
                </div>
                <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {getAIAnalysis()}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lineups' && (
            <div>
              {hasLineups ? (
                <div className="space-y-8">
                  {/* Formation Header */}
                  <div className="flex justify-between items-center px-4">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-cyan-400">{match.home_team}</h3>
                      <p className="text-slate-400 text-sm">4-3-3</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-purple-400">{match.away_team}</h3>
                      <p className="text-slate-400 text-sm">4-2-3-1</p>
                    </div>
                  </div>

                  {/* Visual Field */}
                  <div className="relative bg-slate-800/50 rounded-xl p-8 min-h-[600px] overflow-hidden border border-slate-700">
                    {/* Field Background */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="w-full h-full border-2 border-slate-600 rounded-lg relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1/6 border-b-2 border-x-2 border-slate-600 rounded-b-lg"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1/6 border-t-2 border-x-2 border-slate-600 rounded-t-lg"></div>
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-600 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-slate-600 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                    </div>

                    <div className="relative grid grid-cols-2 gap-8 h-full">
                      {/* Home Team Lineup (Left Side) */}
                      <div className="space-y-6">
                        {match.lineups.home && match.lineups.home.map((player, idx) => (
                          <div key={idx} className="flex items-center gap-3 group">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden border-2 border-cyan-500/50 group-hover:border-cyan-400 transition">
                                {player.photo ? (
                                  <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                    {player.number}
                                  </div>
                                )}
                              </div>
                              {player.rating && (
                                <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-900 ${player.rating >= 7.5 ? 'bg-green-400' :
                                    player.rating >= 6.5 ? 'bg-yellow-400' : 'bg-orange-400'
                                  }`}>
                                  {player.rating}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm group-hover:text-cyan-400 transition">{player.name}</p>
                              <p className="text-slate-500 text-xs">{player.position} • #{player.number}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Away Team Lineup (Right Side) */}
                      <div className="space-y-6 text-right">
                        {match.lineups.away && match.lineups.away.map((player, idx) => (
                          <div key={idx} className="flex items-center gap-3 justify-end group">
                            <div>
                              <p className="text-white font-medium text-sm group-hover:text-purple-400 transition">{player.name}</p>
                              <p className="text-slate-500 text-xs">{player.position} • #{player.number}</p>
                            </div>
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden border-2 border-purple-500/50 group-hover:border-purple-400 transition">
                                {player.photo ? (
                                  <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                    {player.number}
                                  </div>
                                )}
                              </div>
                              {player.rating && (
                                <div className={`absolute -top-1 -left-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-900 ${player.rating >= 7.5 ? 'bg-green-400' :
                                    player.rating >= 6.5 ? 'bg-yellow-400' : 'bg-orange-400'
                                  }`}>
                                  {player.rating}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">Lineups not available yet</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Lineups will be available closer to match time
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              {hasStats ? (
                <div className="space-y-4">
                  {match.statistics.map((stat, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400 font-bold">{stat.home_value || 0}</span>
                        <span className="text-slate-400 text-sm uppercase">{stat.name}</span>
                        <span className="text-purple-400 font-bold">{stat.away_value || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full"
                            style={{ width: `${(stat.home_value / (stat.home_value + stat.away_value)) * 100 || 50}%` }}
                          ></div>
                        </div>
                        <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-purple-500 h-full float-right"
                            style={{ width: `${(stat.away_value / (stat.home_value + stat.away_value)) * 100 || 50}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">Match statistics not available</p>
                  <p className="text-slate-500 text-sm mt-2">
                    {match.status === 'scheduled'
                      ? 'Statistics will be available during and after the match'
                      : 'No statistics data found for this match'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
