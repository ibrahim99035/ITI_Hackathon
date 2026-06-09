const router = require('express').Router()
const Book = require('../models/Book')
const Member = require('../models/Member')
const Loan = require('../models/Loan')
const FinePayment = require('../models/FinePayment')
const asyncHandler = require('../utils/asyncHandler')
const { success } = require('../utils/apiResponse')
const { protect, requireRole } = require('../middleware/auth')

// GET /api/reports/dashboard — KPI stats
router.get('/dashboard', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  // Mark overdue
  const now = new Date()
  await Loan.updateMany(
    { status: 'Active', expectedReturnDate: { $lt: now } },
    { $set: { status: 'Overdue' } }
  )

  const [
    totalBooks,
    totalAvailableBooks,
    totalMembers,
    activeLoans,
    overdueLoans,
    outstandingFines,
    recentActivity
  ] = await Promise.all([
    Book.aggregate([{ $group: { _id: null, total: { $sum: '$totalCopies' } } }]),
    Book.aggregate([{ $group: { _id: null, total: { $sum: '$availableCopies' } } }]),
    Member.countDocuments(),
    Loan.countDocuments({ status: 'Active' }),
    Loan.countDocuments({ status: 'Overdue' }),
    Member.aggregate([{ $group: { _id: null, total: { $sum: '$outstandingFine' } } }]),
    Loan.find()
      .populate('book', 'title author')
      .populate({ path: 'member', populate: { path: 'user', select: 'name' } })
      .sort({ updatedAt: -1 })
      .limit(10)
  ])

  // Fines collected (total payments)
  const finesCollected = await FinePayment.aggregate([
    { $group: { _id: null, total: { $sum: '$amountPaid' } } }
  ])

  // Books added today
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const booksAddedToday = await Book.countDocuments({ createdAt: { $gte: todayStart } })

  // Loans created today
  const loansToday = await Loan.countDocuments({ loanDate: { $gte: todayStart } })

  // Average loan duration (returned loans)
  const avgDuration = await Loan.aggregate([
    { $match: { status: 'Returned', actualReturnDate: { $exists: true } } },
    { $project: { duration: { $divide: [{ $subtract: ['$actualReturnDate', '$loanDate'] }, 1000 * 60 * 60 * 24] } } },
    { $group: { _id: null, avg: { $avg: '$duration' } } }
  ])

  // Return rate
  const totalLoans = await Loan.countDocuments()
  const returnedLoans = await Loan.countDocuments({ status: 'Returned' })
  const returnRate = totalLoans > 0 ? Math.round((returnedLoans / totalLoans) * 100) : 0

  success(res, {
    totalBooks: totalBooks[0]?.total || 0,
    availableBooks: totalAvailableBooks[0]?.total || 0,
    totalMembers,
    activeLoans,
    overdueLoans,
    outstandingFines: outstandingFines[0]?.total || 0,
    finesCollected: finesCollected[0]?.total || 0,
    booksAddedToday,
    loansToday,
    avgLoanDuration: Math.round(avgDuration[0]?.avg || 0),
    returnRate,
    recentActivity
  })
}))

// GET /api/reports/overdue — Overdue details
router.get('/overdue', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const now = new Date()
  await Loan.updateMany(
    { status: 'Active', expectedReturnDate: { $lt: now } },
    { $set: { status: 'Overdue' } }
  )

  const overdueLoans = await Loan.find({ status: 'Overdue' })
    .populate('book', 'title author')
    .populate({ path: 'member', populate: { path: 'user', select: 'name email' } })
    .sort({ expectedReturnDate: 1 })

  // Add overdue days and estimated fine
  const enriched = overdueLoans.map(loan => {
    const diffMs = now.getTime() - loan.expectedReturnDate.getTime()
    const overdueDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return {
      ...loan.toObject(),
      overdueDays,
      estimatedFine: overdueDays * 10
    }
  })

  success(res, enriched)
}))

// GET /api/reports/most-borrowed — Most borrowed books
router.get('/most-borrowed', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const mostBorrowed = await Loan.aggregate([
    { $group: { _id: '$book', borrowCount: { $sum: 1 } } },
    { $sort: { borrowCount: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'bookInfo' } },
    { $unwind: '$bookInfo' },
    { $lookup: { from: 'bookcategories', localField: 'bookInfo.category', foreignField: '_id', as: 'categoryInfo' } },
    { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
    { $project: {
      _id: 0,
      bookId: '$_id',
      title: '$bookInfo.title',
      author: '$bookInfo.author',
      category: '$categoryInfo.name',
      borrowCount: 1,
      totalCopies: '$bookInfo.totalCopies',
      availableCopies: '$bookInfo.availableCopies'
    }}
  ])

  success(res, mostBorrowed)
}))

// GET /api/reports/member-activity — Member activity stats
router.get('/member-activity', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const activity = await Loan.aggregate([
    { $group: {
      _id: '$member',
      totalBorrows: { $sum: 1 },
      activeBorrows: { $sum: { $cond: [{ $in: ['$status', ['Active', 'Overdue']] }, 1, 0] } },
      returnedBorrows: { $sum: { $cond: [{ $eq: ['$status', 'Returned'] }, 1, 0] } },
      totalFines: { $sum: '$fineAmount' }
    }},
    { $sort: { totalBorrows: -1 } },
    { $lookup: { from: 'members', localField: '_id', foreignField: '_id', as: 'memberInfo' } },
    { $unwind: '$memberInfo' },
    { $lookup: { from: 'users', localField: 'memberInfo.user', foreignField: '_id', as: 'userInfo' } },
    { $unwind: '$userInfo' },
    { $project: {
      _id: 0,
      memberId: '$_id',
      name: '$userInfo.name',
      email: '$userInfo.email',
      membershipType: '$memberInfo.membershipType',
      totalBorrows: 1,
      activeBorrows: 1,
      returnedBorrows: 1,
      totalFines: 1,
      outstandingFine: '$memberInfo.outstandingFine'
    }}
  ])

  success(res, activity)
}))

module.exports = router
