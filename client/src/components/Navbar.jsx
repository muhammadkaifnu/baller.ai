import { Home, Calendar, Search, TrendingUp, User, Bell } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const navItems = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: Calendar, label: 'Matches', path: '/matches' },
        { icon: Search, label: 'Scout Hub', path: '/scout' },
        { icon: TrendingUp, label: 'Season Predictor', path: '/predictor' },
        { icon: User, label: 'Profile', path: '/profile' }
    ]

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    })

    return (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between z-50">
            {/* Left Section - Logo & Navigation */}
            <div className="flex items-center gap-8">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                    <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                        <h1 className="text-cyan-400 font-bold text-lg leading-none">Baller AI</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Next Gen</p>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search matches, players..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive
                                    ? 'bg-cyan-500 text-slate-900 font-semibold'
                                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm">{item.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Right Section - Search, Date, Notifications, User */}
            <div className="flex items-center gap-6">
                {/* Search Bar */}


                {/* Date */}
                <span className="text-sm text-slate-400 uppercase hidden lg:block">{today}</span>

                {/* Notification */}
                <button className="relative p-2 hover:bg-slate-800 rounded-lg transition">
                    <Bell className="w-5 h-5 text-slate-400" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* AI Status */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-400">AI Online</span>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
                    <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="text-sm hidden xl:block">
                        <p className="text-slate-300 font-medium">{user?.name || 'Alex Rodriguez'}</p>
                        <p className="text-slate-500 text-xs">PRO MEMBER</p>
                    </div>
                </div>
            </div>
        </nav>
    )
}
