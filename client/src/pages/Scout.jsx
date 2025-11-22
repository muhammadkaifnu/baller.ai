import { useState } from 'react'
import { Search, TrendingUp, TrendingDown } from 'lucide-react'

export default function Scout() {
  const [selectedPosition, setSelectedPosition] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const positions = ['All', 'Attacker', 'Midfielder', 'Defender', 'U21']

  const players = [
    {
      name: 'Erling Haaland',
      team: 'Man City',
      position: 'ST',
      age: 23,
      rating: 94,
      marketValue: '€180M',
      trend: 'up'
    },
    {
      name: 'Jude Bellingham',
      team: 'Real Madrid',
      position: 'CM',
      age: 20,
      rating: 89,
      marketValue: '€150M',
      trend: 'up'
    },
    {
      name: 'Vinícius Jr',
      team: 'Real Madrid',
      position: 'LW',
      age: 23,
      rating: 91,
      marketValue: '€160M',
      trend: 'down'
    },
    {
      name: 'Pedri',
      team: 'Barcelona',
      position: 'CM',
      age: 21,
      rating: 87,
      marketValue: '€100M',
      trend: 'up'
    },
    {
      name: 'Gavi',
      team: 'Barcelona',
      position: 'CM',
      age: 19,
      rating: 84,
      marketValue: '€90M',
      trend: 'up'
    },
    {
      name: 'Kylian Mbappé',
      team: 'Real Madrid',
      position: 'ST',
      age: 25,
      rating: 95,
      marketValue: '€200M',
      trend: 'up'
    }
  ]

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="pb-8 px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">Scout Hub</h1>
        <p className="text-slate-400">AI-powered player analytics and scouting</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Position Filter */}
      <div className="flex gap-3 mb-12">
        {positions.map((pos) => (
          <button
            key={pos}
            onClick={() => setSelectedPosition(pos)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${selectedPosition === pos
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:text-slate-300'
              }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredPlayers.map((player, idx) => (
          <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 transition">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">{player.name}</h3>
                <p className="text-slate-400 text-sm">{player.team} · {player.position} · {player.age}y</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                  {player.rating}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="flex items-end justify-between gap-1 h-16 mb-4 bg-slate-900 rounded p-3">
              {[65, 72, 68, 75, 80, 85, 88].map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cyan-500 rounded-sm"
                  style={{ height: `${(val / 88) * 100}%` }}
                ></div>
              ))}
            </div>

            {/* Market Value */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">MARKET VALUE</span>
              <div className="flex items-center gap-1">
                <span className="text-cyan-400 font-bold">{player.marketValue}</span>
                {player.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
