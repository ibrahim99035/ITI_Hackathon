const mongoose = require('mongoose')

const loanSchema = new mongoose.Schema({
  book:               { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member:             { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  issuedBy:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loanDate:           { type: Date, default: Date.now },
  expectedReturnDate: { type: Date, required: true },
  actualReturnDate:   { type: Date },
  status:             { type: String, enum: ['Active', 'Returned', 'Overdue', 'Lost'], default: 'Active' },
  fineAmount:         { type: Number, default: 0 },
  finePaid:           { type: Boolean, default: false },
  notes:              { type: String }
}, { timestamps: true })

loanSchema.index({ member: 1, book: 1, status: 1, loanDate: -1 })

module.exports = mongoose.model('Loan', loanSchema)
