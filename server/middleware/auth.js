const { requireAuth, clerkClient } = require('@clerk/express')
const User = require('../models/User')

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
        name: `${clerkUser.firstName} ${clerkUser.lastName}`
      })
    }

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { protect, attachUser }
