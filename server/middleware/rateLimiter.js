const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per window
  message: { error: 'Too many requests, slow down.' }
})

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // for sensitive routes like upload
  message: { error: 'Too many requests on this route.' }
})

module.exports = { limiter, strictLimiter }
