const router = require('express').Router()
const BookCategory = require('../models/BookCategory')
const Book = require('../models/Book')
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')
const { success } = require('../utils/apiResponse')
const { protect, requireRole } = require('../middleware/auth')

// GET /api/categories — public
router.get('/', asyncHandler(async (req, res) => {
  const categories = await BookCategory.find().sort({ name: 1 })
  success(res, categories)
}))

// POST /api/categories — Admin only
router.post('/', protect, requireRole('Admin'), asyncHandler(async (req, res) => {
  const { name, description } = req.body
  if (!name) throw new AppError('Category name is required', 400)

  const exists = await BookCategory.findOne({ name })
  if (exists) throw new AppError('Category already exists', 400)

  const category = await BookCategory.create({ name, description })
  success(res, category, 201)
}))

// PUT /api/categories/:id — Admin only
router.put('/:id', protect, requireRole('Admin'), asyncHandler(async (req, res) => {
  const { name, description } = req.body
  const category = await BookCategory.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true, runValidators: true }
  )
  if (!category) throw new AppError('Category not found', 404)
  success(res, category)
}))

// DELETE /api/categories/:id — Admin only, fail if books still use it
router.delete('/:id', protect, requireRole('Admin'), asyncHandler(async (req, res) => {
  const bookCount = await Book.countDocuments({ category: req.params.id })
  if (bookCount > 0) {
    throw new AppError(`Cannot delete category: ${bookCount} book(s) still reference it`, 400)
  }

  const category = await BookCategory.findByIdAndDelete(req.params.id)
  if (!category) throw new AppError('Category not found', 404)
  success(res, { message: 'Category deleted' })
}))

module.exports = router
