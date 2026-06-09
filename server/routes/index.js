const router = require('express').Router()
const { protect, requireRole } = require('../middleware/auth')
const { upload, uploadToCloudinary } = require('../config/cloudinary')
const asyncHandler = require('../utils/asyncHandler')
const { success } = require('../utils/apiResponse')

router.use('/auth', require('./auth'))

router.get('/ping', (req, res) => success(res, { message: 'pong' }))

router.get('/me', protect, asyncHandler(async (req, res) => {
  success(res, req.user)
}))

router.get('/admin-only',     protect, requireRole('Admin'),              (req, res) => success(res, { message: 'hello Admin' }))
router.get('/librarian-only', protect, requireRole('Librarian'),          (req, res) => success(res, { message: 'hello Librarian' }))
router.get('/member-only',    protect, requireRole('Member'),             (req, res) => success(res, { message: 'hello Member' }))
router.get('/staff-only',     protect, requireRole('Admin', 'Librarian'), (req, res) => success(res, { message: 'hello Staff' }))

router.post('/upload', protect, upload.single('file'), asyncHandler(async (req, res) => {
  const result = await uploadToCloudinary(req.file.buffer)
  success(res, { url: result.secure_url })
}))

module.exports = router
