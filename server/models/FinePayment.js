const mongoose = require('mongoose')

const finePaymentSchema = new mongoose.Schema({
  loan:          { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  member:        { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amountPaid:    { type: Number, required: true },
  paymentDate:   { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'Online'], required: true },
  receivedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

module.exports = mongoose.model('FinePayment', finePaymentSchema)
