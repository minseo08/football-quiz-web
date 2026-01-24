const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// 퀴즈 불러오기
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find(); 
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: "퀴즈 로드 실패" });
  }
});

module.exports = router;