import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true) // Start as true to validate token on mount

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token')
      const tokenExpiry = localStorage.getItem('tokenExpiry')

      if (!storedToken || !tokenExpiry) {
        setLoading(false)
        return
      }

      // Check if token has expired (24 hour expiry)
      if (Date.now() > parseInt(tokenExpiry)) {
        console.log('Token expired, logging out')
        logout()
        setLoading(false)
        return
      }

      // Validate token with backend
      try {
        const response = await fetch('http://localhost:5001/api/matches?limit=1', {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        })

        if (response.ok) {
          // Token is valid
          setToken(storedToken)
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        } else {
          // Token is invalid
          console.log('Token invalid, logging out')
          logout()
        }
      } catch (error) {
        console.error('Token validation error:', error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (data.token) {
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        // Set token expiry to 24 hours from now
        localStorage.setItem('tokenExpiry', (Date.now() + 24 * 60 * 60 * 1000).toString())
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email, password, name) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5001/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      const data = await response.json()
      if (data.token) {
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        // Set token expiry to 24 hours from now
        localStorage.setItem('tokenExpiry', (Date.now() + 24 * 60 * 60 * 1000).toString())
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('tokenExpiry')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
