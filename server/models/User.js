const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  clerkId:    { type: String, required: true, unique: true },
  email:      { type: String, required: true, unique: true },
  name:       { type: String },
  phone:      { type: String },
  nationalId: { type: String },
  role:       { type: String, enum: ['Admin', 'Librarian', 'Member'], default: 'Member' },
  isActive:   { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
