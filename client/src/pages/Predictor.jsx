import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { getTeamLogo } from '../utils/teamLogos'

export default function Predictor() {
  const [selectedLeague, setSelectedLeague] = useState('Premier League')
  const [predictions, setPredictions] = useState([])
  const [hotPredictions, setHotPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/predict/season?league=${selectedLeague}`)
        const data = await response.json()
        setPredictions(data.data || [])

        const hotRes = await fetch('http://localhost:8000/api/predict/hot')
        const hotData = await hotRes.json()
        setHotPredictions(hotData.data || [])
      } catch (error) {
        console.error('Error fetching predictions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
  }, [selectedLeague])

  const leagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1']

  const awards = [
    { icon: '👑', title: 'GOLDEN BOOT', player: 'Erling Haaland', goals: '~36 Goals' },
    { icon: '🏆', title: 'SEASON MVP', player: 'Kevin De Bruyne', team: 'Man City' }
  ]

  return (
    <div className="pb-8 px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">Season Predictor</h1>
        <p className="text-slate-400">AI predictions for league standings and awards</p>
      </div>

      {/* League Selector */}
      <div className="flex gap-3 mb-12">
        {leagues.map((league) => (
          <button
            key={league}
            onClick={() => setSelectedLeague(league)}
            className={`px-6 py-2 rounded-full font-semibold transition ${selectedLeague === league
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:text-slate-300'
              }`}
          >
            {league}
          </button>
        ))}
      </div>

      {/* Predicted Champion */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {/* Champion Card */}
        <div className="col-span-2 bg-slate-800 border border-cyan-500 border-opacity-30 rounded-xl p-8">
          <p className="text-slate-400 uppercase text-sm mb-4">Predicted Champion</p>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center text-5xl">
              🔵
            </div>
            <div>
              <h2 className="text-4xl font-bold text-cyan-400 mb-2">Manchester City</h2>
              <p className="text-slate-400">Expected Points: 95</p>
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full" style={{ width: '78%' }}></div>
              </div>
              <span className="text-cyan-400 font-bold">78%</span>
            </div>
          </div>
        </div>

        {/* Awards */}
        <div className="space-y-4">
          {awards.map((award, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="text-3xl mb-2">{award.icon}</div>
              <p className="text-slate-400 text-xs uppercase mb-1">{award.title}</p>
              <p className="text-cyan-400 font-bold">{award.player}</p>
              {award.goals && <p className="text-slate-400 text-sm">{award.goals}</p>}
              {award.team && <p className="text-slate-400 text-sm">{award.team}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Probability Table */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 uppercase">Probability Table</h3>
        {loading ? (
          <div className="text-center text-slate-400">Loading predictions...</div>
        ) : predictions.length > 0 ? (
          <div className="space-y-3">
            {predictions.map((pred) => (
              <div key={pred.rank} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-cyan-500 transition">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold">
                    {pred.rank}
                  </div>
                  <img
                    src={getTeamLogo(pred.team)}
                    alt={pred.team}
                    className="w-8 h-8 object-contain"
                  />
                  <div className="flex-1">
                    <p className="text-white font-semibold">{pred.team}</p>
                    <p className="text-slate-500 text-sm">{pred.predicted_points} pts</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-slate-400 text-sm uppercase">Win Probability</p>
                    <div className="flex items-center gap-2 min-w-max">
                      <div className="w-32 bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-green-400 h-full"
                          style={{ width: `${pred.probability}%` }}
                        ></div>
                      </div>
                      <span className="text-cyan-400 font-bold text-sm">{pred.probability}%</span>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400">No predictions available</div>
        )}
      </div>
    </div>
  )
}
