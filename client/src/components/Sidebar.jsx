import { Home, Calendar, Search, TrendingUp, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Matches', path: '/matches' },
    { icon: Search, label: 'Scout Hub', path: '/scout' },
    { icon: TrendingUp, label: 'Season Predictor', path: '/predictor' },
    { icon: User, label: 'Profile', path: '/profile' }
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-48 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="text-cyan-400 font-bold text-lg">Football</h1>
            <p className="text-cyan-400 font-bold text-lg">AI</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-wider">Next Gen Scout</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-900 font-semibold'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* AI Status */}
      <div className="border-t border-slate-800 pt-4">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-400">AI STATUS</span>
        </div>
        <p className="text-cyan-400 text-sm mt-2">All Systems Online</p>
      </div>
    </div>
  )
}
