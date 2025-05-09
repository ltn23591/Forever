import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                msg: 'No token provided, please login again',
            });
        }

        const token = authHeader.split(' ')[1];
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(token_decode.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Not authorized as admin',
            });
        }

        req.user = { userId: token_decode.id };
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                msg: 'Token expired, please login again',
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                msg: 'Invalid token, please login again',
            });
        }
        res.status(500).json({
            success: false,
            msg: 'Server error during authentication',
        });
    }
};

export default adminAuth;
