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

// 퀴즈 추가하기
router.post('/', async (req, res) => {
  try {
    const { type, question, imageUrls, options, answer } = req.body;

    if (!type || !question || !imageUrls || !answer) {
      return res.status(400).json({ 
        success: false, 
        message: '모든 필수 필드를 입력해주세요.' 
      });
    }

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '최소 하나의 이미지 URL이 필요합니다.' 
      });
    }

    const validTypes = ['logo', 'player', 'stadium'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: '유효하지 않은 퀴즈 타입입니다.' 
      });
    }

    if ((type === 'logo' || type === 'stadium') && (!options || !Array.isArray(options) || options.length < 2)) {
      return res.status(400).json({ 
        success: false, 
        message: '객관식 문제는 최소 2개 이상의 선택지가 필요합니다.' 
      });
    }

    const newQuizData = {
      type,
      question,
      imageUrls,
      answer
    };

    if (type === 'logo' || type === 'stadium') {
      newQuizData.options = options;
    }

    const newQuiz = new Quiz(newQuizData);
    const savedQuiz = await newQuiz.save();

    res.json({ 
      success: true, 
      message: '퀴즈가 성공적으로 추가되었습니다.',
      quiz: savedQuiz
    });

  } catch (error) {
    console.error('퀴즈 추가 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

module.exports = router;