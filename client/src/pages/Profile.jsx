import { useAuth } from '../context/AuthContext'
import { LogOut, Settings } from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="pb-8 px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">Profile</h1>
        <p className="text-slate-400">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center text-4xl font-bold text-slate-900">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{user?.name || 'Alex Rodriguez'}</h2>
              <p className="text-cyan-400 font-semibold mb-1">{user?.email || 'alex@example.com'}</p>
              <p className="text-slate-400">PRO MEMBER</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">Account Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Predictions Made</p>
                <p className="text-2xl font-bold text-cyan-400">168</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Accuracy Rate</p>
                <p className="text-2xl font-bold text-green-400">85%</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Member Since</p>
                <p className="text-sm font-bold text-slate-300">Nov 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <span className="text-slate-300">Email Notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <span className="text-slate-300">Dark Mode</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Two-Factor Authentication</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
