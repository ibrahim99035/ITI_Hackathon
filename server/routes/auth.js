const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')
const { protect } = require('../middleware/auth')
const { success } = require('../utils/apiResponse')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body
  const exists = await User.findOne({ email })
  if (exists) throw new AppError('Email already in use', 400)
  const user = await User.create({ name, email, password, role })
  const token = signToken(user._id)
  success(res, {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  }, 201)
}))

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new AppError('Email and password required', 400)
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password)))
    throw new AppError('Invalid email or password', 401)
  if (!user.isActive) throw new AppError('Account deactivated', 403)
  const token = signToken(user._id)
  success(res, {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  })
}))

router.get('/me', protect, asyncHandler(async (req, res) => {
  success(res, req.user)
}))

module.exports = router
