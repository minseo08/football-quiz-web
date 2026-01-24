const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  type: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  options: [String],
  imageUrls: [String]
});

module.exports = mongoose.model('Quiz', quizSchema);