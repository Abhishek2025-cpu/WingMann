const jwt = require('jsonwebtoken');
const { ADMIN_SECRET, EMPLOYEE_SECRET } = require('../utils/jwtUtils');

function auth(role) {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        try {
            let decoded;

            if (role === 'admin') {
                decoded = jwt.verify(token, ADMIN_SECRET);
            } else if (role === 'employee') {
                decoded = jwt.verify(token, EMPLOYEE_SECRET);
            } else {
                return res.status(403).json({ message: 'Invalid role' });
            }

            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}

module.exports = auth;
