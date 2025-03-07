import User from "../models/user.js";
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import * as utils from '../utils.js';

export const register = async (req, res) => {
    const { 
        name, 
        email, 
        password, 
        location, 
        bio, 
        skills, 
        causesSupported 
    } = req.body;

    // validation!!
    
    if (await User.findOne({ email: email })) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "An acount with this email already exists" });
    }
    
    const user = await User.create({
        name: name,
        email: email,
        password: await utils.generateHash(password),
        location: location,
        bio: bio,
        skills: skills,
        causesSupported: causesSupported
    });

    const token = utils.generateJWT(user._id);

    console.log('token generated')
    res.header('Authorization', `Bearer ${token}`).status(StatusCodes.CREATED).json({ id: user._id });
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    // validation!!

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid email or password!" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid email or password!" });
    }

    const token = utils.generateJWT(user._id);
    res.header('Authorization', `Bearer ${token}`).status(StatusCodes.OK).json({ id: user._id });


}