const Admin = require('../models/adminModel');
const { generateToken } = require('../utils/jwtUtils');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user existence
        const user = await Admin.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate token based on role
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            role: user.role,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
