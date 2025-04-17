import jwt from 'jsonwebtoken'

const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey)
}

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'User is not authenticated',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifyToken(token, 'JWT_SECRET')

    req.user = payload

    next()
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: 'invalid token',
    })
  }
}

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, 'JWT_SECRET')
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

export { authenticate, verifyAdmin }
