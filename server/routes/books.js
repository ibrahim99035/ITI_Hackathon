const router = require('express').Router()
const Book = require('../models/Book')
const Loan = require('../models/Loan')
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')
const { success } = require('../utils/apiResponse')
const { protect, requireRole } = require('../middleware/auth')

// GET /api/books — public, with search/filter
router.get('/', asyncHandler(async (req, res) => {
  const { q, category, availability, page = 1, limit = 50 } = req.query
  const filter = {}

  // Text search
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
      { isbn: { $regex: q, $options: 'i' } }
    ]
  }

  // Category filter
  if (category) {
    filter.category = category
  }

  // Availability filter
  if (availability === 'available') {
    filter.availableCopies = { $gt: 0 }
  } else if (availability === 'unavailable') {
    filter.availableCopies = 0
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [books, total] = await Promise.all([
    Book.find(filter)
      .populate('category', 'name description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Book.countDocuments(filter)
  ])

  success(res, { books, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
}))

// GET /api/books/:id — public
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('category', 'name description')
  if (!book) throw new AppError('Book not found', 404)
  success(res, book)
}))

// POST /api/books — Admin/Librarian
router.post('/', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const { isbn, title, author, publisher, publicationYear, category, totalCopies, description, coverImageUrl } = req.body
  if (!title || !author || !category) {
    throw new AppError('Title, author, and category are required', 400)
  }

  const book = await Book.create({
    isbn, title, author, publisher, publicationYear,
    category, totalCopies: totalCopies || 1,
    availableCopies: totalCopies || 1,
    description, coverImageUrl
  })

  const populated = await book.populate('category', 'name description')
  success(res, populated, 201)
}))

// PUT /api/books/:id — Admin/Librarian
router.put('/:id', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id)
  if (!book) throw new AppError('Book not found', 404)

  const { isbn, title, author, publisher, publicationYear, category, totalCopies, description, coverImageUrl } = req.body

  // If totalCopies is changed, adjust availableCopies proportionally
  if (totalCopies !== undefined && totalCopies !== book.totalCopies) {
    const borrowed = book.totalCopies - book.availableCopies
    if (totalCopies < borrowed) {
      throw new AppError(`Cannot set total copies below currently borrowed count (${borrowed})`, 400)
    }
    book.availableCopies = totalCopies - borrowed
    book.totalCopies = totalCopies
  }

  if (isbn !== undefined) book.isbn = isbn
  if (title !== undefined) book.title = title
  if (author !== undefined) book.author = author
  if (publisher !== undefined) book.publisher = publisher
  if (publicationYear !== undefined) book.publicationYear = publicationYear
  if (category !== undefined) book.category = category
  if (description !== undefined) book.description = description
  if (coverImageUrl !== undefined) book.coverImageUrl = coverImageUrl

  await book.save()
  const populated = await book.populate('category', 'name description')
  success(res, populated)
}))

// DELETE /api/books/:id — Admin/Librarian, fail if active loans
router.delete('/:id', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const activeLoans = await Loan.countDocuments({
    book: req.params.id,
    status: { $in: ['Active', 'Overdue'] }
  })
  if (activeLoans > 0) {
    throw new AppError(`Cannot delete book: ${activeLoans} active loan(s) exist`, 400)
  }

  const book = await Book.findByIdAndDelete(req.params.id)
  if (!book) throw new AppError('Book not found', 404)
  success(res, { message: 'Book deleted' })
}))

module.exports = router
