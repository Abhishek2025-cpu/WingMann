const Quiz = require('../models/Quiz');

exports.submitQuiz = async (req, res) => {
    try {
        const { quizzes } = req.body; // Hum expect kar rahe hain { "quizzes": [...] }
        const userId = req.user.id;   // Middleware se mil raha hai

        // 1. Check karo ki array bheja bhi hai ya nahi
        if (!quizzes || !Array.isArray(quizzes) || quizzes.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide an array of quizzes in the 'quizzes' key." 
            });
        }

        // 2. Data Prepare: Har quiz category ke object mein userId ghusana
        const quizzesToSave = quizzes.map((quiz, index) => {
            // Validation: Har quiz ke andar answers hona zaruri hai
            if (!quiz.answers || !Array.isArray(quiz.answers) || quiz.answers.length === 0) {
                throw new Error(`Quiz at index ${index} (${quiz.quizName || 'Unknown'}) is missing answers.`);
            }

            return {
                userId: userId,
                quizName: quiz.quizName,
                answers: quiz.answers // Ye answers khud ek array hai [{question, selectedOption}]
            };
        });

        // 3. Bulk Insert: Saare 5 cards ka data ek saath database mein save hoga
        const savedQuizzes = await Quiz.insertMany(quizzesToSave);

        res.status(201).json({ 
            success: true, 
            message: `${savedQuizzes.length} Quiz categories submitted successfully!`, 
            data: savedQuizzes 
        });

    } catch (error) {
        console.error("❌ Submit Error:", error.message);

        // Validation ya Enum error handling
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: "Validation Error: Check quiz names or structure.",
                error: error.message 
            });
        }

        res.status(400).json({ 
            success: false, 
            message: error.message || "Internal Server Error" 
        });
    }
};

// Baaki functions (getUserQuizzes, getQuizById) jo aapke paas hain wo sahi hain.


exports.getUserQuizzes = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Latest quizzes pehle dikhane ke liye sort use kiya hai
        const quizzes = await Quiz.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            totalAttempted: quizzes.length, 
            data: quizzes 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching quizzes",
            error: error.message 
        });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const userId = req.user.id;
        const quizId = req.params.id;

        // Ensure user sirf apna hi quiz dekh sake
        const quiz = await Quiz.findOne({ _id: quizId, userId: userId });

        if (!quiz) {
            return res.status(404).json({ 
                success: false, 
                message: "Quiz not found or unauthorized" 
            });
        }

        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Invalid ID or Server Error",
            error: error.message 
        });
    }
};

exports.resetQuizzes = async (req, res) => {
    try {
        await Quiz.deleteMany({ userId: req.user.id });
        res.status(200).json({ success: true, message: "All quiz records cleared." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};