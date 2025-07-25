import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'; 

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        if(!token){
            return res.status(401).json({message: 'No token, authorization denied'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: 'Token is invalid, authorization denied'});
        }
        const user = await User.findById(decoded.userID).select('-password');
        if(!user){
            return res.status(401).json({message: 'User not found, authorization denied'});
        }
        req.user = user;
        next();


    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
}