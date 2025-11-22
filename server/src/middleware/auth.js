import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here'

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

export const adminMiddleware = (req, res, next) => {
  // First verify token
  authMiddleware(req, res, () => {
    // In a real app, you'd check the user's role from the database
    // For now, we'll check if it's passed in headers or use a simple check
    const isAdmin = req.headers['x-admin'] === 'true'
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required' })
    }
    
    next()
  })
}
