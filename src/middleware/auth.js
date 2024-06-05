const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
         const authHeader = req.header('Authorization');
        
    
        const token = authHeader.replace('Bearer ', '').trim();
        

        console.log('Token:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded:', decoded);

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            console.error('User not found with given token');
            throw new Error('User not found with given token');
        }

        req.user = user;
        req.token = token;
        
        next()
        
    } catch (e) {
        console.error('Authentication error:', e.message);
        res.status(401).send({ error: "Please authenticate the user" });
    }
};

module.exports = auth;
