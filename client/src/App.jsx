import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Matches from './pages/Matches'
import Scout from './pages/Scout'
import Predictor from './pages/Predictor'
import Profile from './pages/Profile'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import NewsArticle from './pages/NewsArticle'
import './App.css'

function ProtectedLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="pt-20">
        {children}
      </div>
    </div>
  )
}

function AppRoutes() {
  const { token } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/home" />} />

      <Route path="/home" element={token ? <ProtectedLayout><Home /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={<Navigate to="/home" replace />} />
      <Route path="/matches" element={token ? <ProtectedLayout><Matches /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/scout" element={token ? <ProtectedLayout><Scout /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/predictor" element={token ? <ProtectedLayout><Predictor /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/profile" element={token ? <ProtectedLayout><Profile /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/news/:id" element={token ? <ProtectedLayout><NewsArticle /></ProtectedLayout> : <Navigate to="/login" />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="bg-slate-900 min-h-screen">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
