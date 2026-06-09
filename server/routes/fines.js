const router = require('express').Router()
const Loan = require('../models/Loan')
const Member = require('../models/Member')
const FinePayment = require('../models/FinePayment')
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')
const { success } = require('../utils/apiResponse')
const { protect, requireRole } = require('../middleware/auth')

// GET /api/fines — All loans with fines
router.get('/', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const loans = await Loan.find({ fineAmount: { $gt: 0 } })
    .populate('book', 'title author')
    .populate({ path: 'member', populate: { path: 'user', select: 'name email' } })
    .sort({ createdAt: -1 })

  success(res, loans)
}))

// GET /api/fines/unpaid — Unpaid fines only
router.get('/unpaid', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const loans = await Loan.find({ fineAmount: { $gt: 0 }, finePaid: false })
    .populate('book', 'title author')
    .populate({ path: 'member', populate: { path: 'user', select: 'name email' } })
    .sort({ createdAt: -1 })

  success(res, loans)
}))

// POST /api/fines/:loanId/pay — Record a fine payment
router.post('/:loanId/pay', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const { amountPaid, paymentMethod } = req.body
  if (!amountPaid || amountPaid <= 0) throw new AppError('Amount must be greater than zero', 400)
  if (!paymentMethod) throw new AppError('Payment method is required', 400)

  const loan = await Loan.findById(req.params.loanId)
  if (!loan) throw new AppError('Loan not found', 404)
  if (loan.fineAmount <= 0) throw new AppError('This loan has no fine', 400)
  if (loan.finePaid) throw new AppError('Fine is already paid', 400)

  // Create payment record
  const payment = await FinePayment.create({
    loan: loan._id,
    member: loan.member,
    amountPaid,
    paymentMethod,
    receivedBy: req.user._id
  })

  // Check total paid for this loan
  const totalPaid = await FinePayment.aggregate([
    { $match: { loan: loan._id } },
    { $group: { _id: null, total: { $sum: '$amountPaid' } } }
  ])
  const paid = totalPaid[0]?.total || 0

  // If total covers the fine, mark as paid
  if (paid >= loan.fineAmount) {
    loan.finePaid = true
    await loan.save()
  }

  // Reduce member outstanding fine
  await Member.findByIdAndUpdate(loan.member, {
    $inc: { outstandingFine: -amountPaid }
  })

  success(res, payment, 201)
}))

// GET /api/payments — Payment history
router.get('/payments', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const payments = await FinePayment.find()
    .populate({ path: 'loan', populate: { path: 'book', select: 'title' } })
    .populate({ path: 'member', populate: { path: 'user', select: 'name' } })
    .populate('receivedBy', 'name')
    .sort({ paymentDate: -1 })

  success(res, payments)
}))

module.exports = router
