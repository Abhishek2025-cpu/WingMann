const jwt = require('jsonwebtoken');

const ADMIN_SECRET = 'adminSecretKey123';
const EMPLOYEE_SECRET = 'employeeSecretKey123';

function generateToken(user) {
    const payload = {
        id: user._id,
        role: user.role,
        email: user.email
    };

    if (user.role === 'admin') {
        return jwt.sign(payload, ADMIN_SECRET, { expiresIn: '1h' });
    } else if (user.role === 'employee') {
        return jwt.sign(payload, EMPLOYEE_SECRET, { expiresIn: '1h' });
    }
}

module.exports = { generateToken, ADMIN_SECRET, EMPLOYEE_SECRET };
