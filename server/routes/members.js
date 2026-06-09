const router = require('express').Router()
const Member = require('../models/Member')
const User = require('../models/User')
const Loan = require('../models/Loan')
const FinePayment = require('../models/FinePayment')
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')
const { success } = require('../utils/apiResponse')
const { protect, requireRole } = require('../middleware/auth')

// GET /api/members — Admin/Librarian
router.get('/', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const members = await Member.find()
    .populate('user', 'name email phone role isActive')
    .sort({ createdAt: -1 })

  // Enrich with loan counts
  const enriched = await Promise.all(members.map(async (m) => {
    const [activeLoans, returnedLoans] = await Promise.all([
      Loan.countDocuments({ member: m._id, status: { $in: ['Active', 'Overdue'] } }),
      Loan.countDocuments({ member: m._id, status: 'Returned' })
    ])
    return {
      ...m.toObject(),
      activeLoans,
      returnedLoans
    }
  }))

  success(res, enriched)
}))

// GET /api/members/:id — Admin/Librarian
router.get('/:id', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id)
    .populate('user', 'name email phone role isActive')
  if (!member) throw new AppError('Member not found', 404)

  const [activeLoans, returnedLoans, activeBooks] = await Promise.all([
    Loan.countDocuments({ member: member._id, status: { $in: ['Active', 'Overdue'] } }),
    Loan.countDocuments({ member: member._id, status: 'Returned' }),
    Loan.find({ member: member._id, status: { $in: ['Active', 'Overdue'] } })
      .populate('book', 'title author')
      .select('book loanDate expectedReturnDate status')
  ])

  success(res, {
    ...member.toObject(),
    activeLoans,
    returnedLoans,
    activeBooks
  })
}))

// POST /api/members — Admin/Librarian (creates user + member profile)
router.post('/', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const { name, email, password, phone, nationalId, membershipType, membershipEnd } = req.body
  if (!name || !email || !password || !membershipType) {
    throw new AppError('Name, email, password, and membership type are required', 400)
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new AppError('Email already in use', 400)

  // Create User with role Member
  const user = await User.create({
    name, email, password, phone, nationalId, role: 'Member'
  })

  // Generate membership number
  const count = await Member.countDocuments()
  const membershipNumber = `MEM-${String(count + 1).padStart(5, '0')}`

  // Create Member profile
  const member = await Member.create({
    user: user._id,
    membershipNumber,
    membershipType,
    membershipStart: new Date(),
    membershipEnd: membershipEnd || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // default 1 year
  })

  const populated = await member.populate('user', 'name email phone role isActive')
  success(res, populated, 201)
}))

// PUT /api/members/:id — Admin/Librarian
router.put('/:id', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const { membershipType, membershipEnd, isActive } = req.body
  const member = await Member.findById(req.params.id)
  if (!member) throw new AppError('Member not found', 404)

  if (membershipType) member.membershipType = membershipType
  if (membershipEnd) member.membershipEnd = membershipEnd
  await member.save()

  // Optionally update user active status
  if (isActive !== undefined) {
    await User.findByIdAndUpdate(member.user, { isActive })
  }

  const populated = await member.populate('user', 'name email phone role isActive')
  success(res, populated)
}))

// GET /api/members/:id/history — borrow history
router.get('/:id/history', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id)
  if (!member) throw new AppError('Member not found', 404)

  const loans = await Loan.find({ member: member._id })
    .populate('book', 'title author')
    .populate('issuedBy', 'name')
    .sort({ loanDate: -1 })

  success(res, loans)
}))

// GET /api/members/:id/fines — fine summary
router.get('/:id/fines', protect, requireRole('Admin', 'Librarian'), asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id)
  if (!member) throw new AppError('Member not found', 404)

  const [unpaidLoans, payments] = await Promise.all([
    Loan.find({ member: member._id, fineAmount: { $gt: 0 }, finePaid: false })
      .populate('book', 'title')
      .select('book fineAmount loanDate actualReturnDate'),
    FinePayment.find({ member: member._id })
      .populate('loan', 'book fineAmount')
      .sort({ paymentDate: -1 })
  ])

  success(res, {
    outstandingFine: member.outstandingFine,
    unpaidLoans,
    payments
  })
}))

module.exports = router
