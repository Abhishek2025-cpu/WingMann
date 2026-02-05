const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token" });
        }

        // Verify Token
         console.log("sdbfhsd", process.env.JWT_SECRET)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       

        // Request mein user ID daal di
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, message: "Token is invalid or expired" });
    }
};