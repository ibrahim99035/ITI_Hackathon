const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
  user:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  membershipNumber: { type: String, required: true, unique: true },
  membershipType:   { type: String, enum: ['Student', 'Faculty', 'Public'], required: true },
  membershipStart:  { type: Date, required: true },
  membershipEnd:    { type: Date, required: true },
  outstandingFine:  { type: Number, default: 0 }
}, { timestamps: true })

memberSchema.index({ membershipNumber: 1, user: 1 })

module.exports = mongoose.model('Member', memberSchema)
