const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  isbn:            { type: String, unique: true, sparse: true },
  title:           { type: String, required: true },
  author:          { type: String, required: true },
  publisher:       { type: String },
  publicationYear: { type: Number },
  category:        { type: mongoose.Schema.Types.ObjectId, ref: 'BookCategory', required: true },
  totalCopies:     { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  description:     { type: String },
  coverImageUrl:   { type: String }
}, { timestamps: true })

bookSchema.index({ title: 'text', author: 'text' })
bookSchema.index({ isbn: 1, category: 1 })

module.exports = mongoose.model('Book', bookSchema)
