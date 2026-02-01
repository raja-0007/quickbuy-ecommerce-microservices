const jwt =  require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = async(req, res, next) =>{
    let authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({ message: 'No token provided' });
    }
    let token = authHeader.split(' ')[1];
    // console.log('Token received:', token);
    await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            console.error('Token verification failed:', err);
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        req.role = decoded.role;
    });
    // console.log('Token verified:', token);
    next();
}
module.exports = authMiddleware;