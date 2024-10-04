import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer', '')
    if(!token) {
        return res.status(401).json({
            message: 'No token provide'
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(error) {
        return res.status(401).json({
            message: 'Invalid token'
        })
    }
}

export default authMiddleware