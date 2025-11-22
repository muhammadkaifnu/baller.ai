import { Search, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function TopBar() {
  const { user } = useAuth()
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="fixed top-0 left-48 right-0 h-20 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search matches, players, teams..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-8">
        {/* Date */}
        <span className="text-sm text-slate-400 uppercase">{today}</span>

        {/* Notification */}
        <button className="relative p-2 hover:bg-slate-800 rounded-lg transition">
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
          <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="text-sm">
            <p className="text-slate-300 font-medium">{user?.name || 'Alex Rodriguez'}</p>
            <p className="text-slate-500 text-xs">PRO MEMBER</p>
          </div>
        </div>
      </div>
    </div>
  )
}
