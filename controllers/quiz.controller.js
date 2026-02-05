const Quiz = require('../models/Quiz');

// 1. Submit Quiz (POST)
exports.submitQuiz = async (req, res) => {
    try {
        const { quizName, answers } = req.body;
        const userId = req.user.id; 

        if (!answers || answers.length === 0) {
            return res.status(400).json({ success: false, message: "Answers are required" });
        }

        const newQuiz = new Quiz({
            userId,
            quizName,
            answers
        });

        await newQuiz.save();
        res.status(201).json({ success: true, message: "Quiz submitted successfully", data: newQuiz });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Get All Quizzes of Logged-in User
exports.getUserQuizzes = async (req, res) => {
    try {
        const userId = req.user.id;
        const quizzes = await Quiz.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, totalAttempted: quizzes.length, data: quizzes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Get Specific Quiz by ID
exports.getQuizById = async (req, res) => {
    try {
        const userId = req.user.id;
        const quiz = await Quiz.findOne({ _id: req.params.id, userId: userId });

        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }
        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        res.status(500).json({ success: false, error: "Invalid ID or Server Error" });
    }
};