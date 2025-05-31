import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey'
const NODE_ENV = process.env.NODE_ENV || 'development';

export const genrateToken = (userID, res) =>{
    const token = jwt.sign({ userID },JWT_SECRET, {
        expiresIn: '7d',
    });      
    res.cookie("jwt",token,{
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevent XSS atacks cross-site scripting attack 
        sameSite: "strict", // CSRF attack cross-site request frogery attacks
        secure: NODE_ENV !== 'development',
    })

    return token;
}