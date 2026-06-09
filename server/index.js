require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const connectDB = require('./config/db')
const logger = require('./middleware/logger')
const errorHandler = require('./middleware/error')
const notFound = require('./middleware/notFound')
const { limiter } = require('./middleware/rateLimiter')

const app = express()

connectDB()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)
app.use(limiter)

app.get('/health', (req, res) => res.json({ status: '✅ running' }))
app.use('/api', require('./routes/index'))

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`✅ Server on port ${PORT}`))
