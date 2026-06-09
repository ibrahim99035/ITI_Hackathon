const router = require('express').Router()
const { protect, attachUser } = require('../middleware/auth')
const { upload, uploadToCloudinary } = require('../config/cloudinary')
const asyncHandler = require('../utils/asyncHandler')
const { success } = require('../utils/apiResponse')

router.get('/me', protect, attachUser, asyncHandler(async (req, res) => {
  success(res, req.user)
}))

router.post('/upload', protect, attachUser, upload.single('file'), asyncHandler(async (req, res) => {
  const result = await uploadToCloudinary(req.file.buffer)
  success(res, { url: result.secure_url })
}))

module.exports = router
