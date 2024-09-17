const jwt = require('jsonwebtoken');

module.exports = authenticateToken;
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer Token

    if (token == null) {
        return res.status(401).json({ error: 'No token provided. Please authenticate.' }); // If no token, respond with unauthorized
    }
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token. Access denied.' }); // If token is invalid or expired, respond with forbidden
        }

        req.user = user; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    });
}