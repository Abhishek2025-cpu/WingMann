const express = require('express');
const router = express.Router();
const { submitQuiz, getUserQuizzes, getQuizById } = require('../controllers/quiz.controller'); // Check filename carefully
const { protect } = require('../middlewares/authMiddleware');

router.post('/submit', protect, submitQuiz);
router.get('/my-quizzes', protect, getUserQuizzes);
router.get('/:id', protect, getQuizById);
 
module.exports = router;