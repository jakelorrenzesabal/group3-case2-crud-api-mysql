// middleware/authorize.js
const Role = require('_helpers/role');

module.exports = function (roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'not Authorize' });
        }
        next();
    };
}