const jwt = require("jsonwebtoken");
const User = require('../models/User');

const authenticateJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authentication token required'
            });
        }
        // authentication header use the 'Bearer token' format 'Bearer' index [0] token index [1]
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.userId).select('-password'); // retrieves user from db without the password
            if (!user) {
                return res.status(401).send({message: 'User not found'});
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(403).send({message: 'Invalid or expired token'});
        }
    } catch (error) {
        return res.status(500).send({message: 'Authentication error'});
    }
}

module.exports = authenticateJWT;