const router = require('express').Router()
const Loan = require('../models/Loan')
const Book = require('../models/Book')
const Member = require('../models/Member')
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')
const { success } = require('../utils/apiResponse')
const { protect, requireRole } = require('../middleware/auth')

const DAILY_FINE_RATE = 10 // SAR per day

// Helper: check and mark overdue loans
async function markOverdue() {
  const now = new Date()
  await Loan.updateMany(
    { status: 'Active', expectedReturnDate: { $lt: now } },
    { $set: { status: 'Overdue' } }
  )
}

// GET /api/loans — Admin/Librarian, optional status filter
router.get('/', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  await markOverdue()
  const filter = {}
  if (req.query.status) filter.status = req.query.status

  const loans = await Loan.find(filter)
    .populate('book', 'title author isbn')
    .populate({ path: 'member', populate: { path: 'user', select: 'name email' } })
    .populate('issuedBy', 'name')
    .sort({ loanDate: -1 })

  success(res, loans)
}))

// GET /api/loans/active — Active loans
router.get('/active', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  await markOverdue()
  const loans = await Loan.find({ status: { $in: ['Active', 'Overdue'] } })
    .populate('book', 'title author isbn')
    .populate({ path: 'member', populate: { path: 'user', select: 'name email' } })
    .populate('issuedBy', 'name')
    .sort({ expectedReturnDate: 1 })

  success(res, loans)
}))

// GET /api/loans/overdue — Overdue only
router.get('/overdue', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  await markOverdue()
  const loans = await Loan.find({ status: 'Overdue' })
    .populate('book', 'title author isbn')
    .populate({ path: 'member', populate: { path: 'user', select: 'name email' } })
    .populate('issuedBy', 'name')
    .sort({ expectedReturnDate: 1 })

  success(res, loans)
}))

// GET /api/loans/:id — Single loan
router.get('/:id', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id)
    .populate('book', 'title author isbn')
    .populate({ path: 'member', populate: { path: 'user', select: 'name email' } })
    .populate('issuedBy', 'name')
  if (!loan) throw new AppError('Loan not found', 404)
  success(res, loan)
}))

// POST /api/loans — Create a new loan
router.post('/', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const { book: bookId, member: memberId, expectedReturnDate, notes } = req.body
  if (!bookId || !memberId || !expectedReturnDate) {
    throw new AppError('Book, member, and expected return date are required', 400)
  }

  // Validate book exists and has available copies
  const book = await Book.findById(bookId)
  if (!book) throw new AppError('Book not found', 404)
  if (book.availableCopies <= 0) throw new AppError('No available copies of this book', 400)

  // Validate member exists
  const member = await Member.findById(memberId)
  if (!member) throw new AppError('Member not found', 404)

  // Check membership is active
  if (new Date() > member.membershipEnd) {
    throw new AppError('Member\'s membership has expired', 400)
  }

  // Decrement available copies
  book.availableCopies -= 1
  await book.save()

  // Create loan
  const loan = await Loan.create({
    book: bookId,
    member: memberId,
    issuedBy: req.user._id,
    expectedReturnDate,
    notes,
    status: 'Active'
  })

  const populated = await loan.populate([
    { path: 'book', select: 'title author isbn' },
    { path: 'member', populate: { path: 'user', select: 'name email' } },
    { path: 'issuedBy', select: 'name' }
  ])

  success(res, populated, 201)
}))

// POST /api/loans/:id/return — Return a book
router.post('/:id/return', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id)
  if (!loan) throw new AppError('Loan not found', 404)
  if (loan.status === 'Returned') throw new AppError('This loan has already been returned', 400)

  const now = new Date()
  loan.actualReturnDate = now
  loan.status = 'Returned'

  // Calculate fine
  if (now > loan.expectedReturnDate) {
    const diffMs = now.getTime() - loan.expectedReturnDate.getTime()
    const overdueDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    loan.fineAmount = overdueDays * DAILY_FINE_RATE
    loan.finePaid = false

    // Update member outstanding fine
    await Member.findByIdAndUpdate(loan.member, {
      $inc: { outstandingFine: loan.fineAmount }
    })
  } else {
    loan.fineAmount = 0
    loan.finePaid = true
  }

  await loan.save()

  // Increment available copies
  await Book.findByIdAndUpdate(loan.book, {
    $inc: { availableCopies: 1 }
  })

  const populated = await loan.populate([
    { path: 'book', select: 'title author isbn' },
    { path: 'member', populate: { path: 'user', select: 'name email' } },
    { path: 'issuedBy', select: 'name' }
  ])

  success(res, populated)
}))

module.exports = router
