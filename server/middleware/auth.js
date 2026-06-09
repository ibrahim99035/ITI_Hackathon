const { requireAuth, clerkClient } = require('@clerk/express')
const User = require('../models/User')
const AppError = require('../utils/AppError')

const protect = requireAuth()

const attachUser = async (req, res, next) => {
  try {
    const clerkId = req.auth.userId
    let user = await User.findOne({ clerkId })

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId)
      user = await User.create({
        clerkId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name:  `${clerkUser.firstName} ${clerkUser.lastName}`
      })
    }

    if (!user.isActive) return next(new AppError('Your account has been deactivated.', 403))

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(new AppError('User not attached. Use attachUser first.', 500))
  if (!roles.includes(req.user.role))
    return next(new AppError(`Access denied. Required role: ${roles.join(' or ')}`, 403))
  next()
}

module.exports = { protect, attachUser, requireRole }
