const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, required: true, select: false },
  name:       { type: String },
  phone:      { type: String },
  nationalId: { type: String },
  role:       { type: String, enum: ['Admin', 'Librarian', 'Member'], default: 'Member' },
  isActive:   { type: Boolean, default: true }
}, { timestamps: true })

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)
