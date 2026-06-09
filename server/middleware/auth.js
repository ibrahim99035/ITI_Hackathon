const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) return next(new AppError('Not authenticated', 401))

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return next(new AppError('Invalid or expired token', 401))
  }

  const user = await User.findById(decoded.id)
  if (!user) return next(new AppError('User no longer exists', 401))
  if (!user.isActive) return next(new AppError('Account deactivated', 403))

  req.user = user
  next()
})

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(new AppError('Use protect middleware first', 500))
  if (!roles.includes(req.user.role))
    return next(new AppError(`Access denied. Required: ${roles.join(' or ')}`, 403))
  next()
}

module.exports = { protect, requireRole }
