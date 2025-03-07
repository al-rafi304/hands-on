import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as env from './env.js';

export const generateHash = async (string) => {
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(string, salt);
    return hashed;
}

export const generateJWT = (userID) => {
    const token = jwt.sign(
        { id: userID },
        env.JWT_SECRET,
        { expiresIn: env.JWT_LIFETIME }
    )
    return token;
}