import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import env from '../env.js';

import User from '../models/user.js';

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
    
        if (!authHeader) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized access: no token" });
        }
    
        const [scheme, token] = authHeader.split(' ');
        if(scheme !== 'Bearer' || !token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized access" });
        }

        const verified = jwt.verify(token, env.JWT_SECRET);
        const user = User.findById(verified.id);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
        }

        req.user = user;
        
        next();
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Authentication failed", error: err.message });
    }
}