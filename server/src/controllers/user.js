import { StatusCodes } from 'http-status-codes';
import User from '../models/user.js';

export const getUser = async (req, res) => {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    res.status(StatusCodes.OK).json(user);
}

export const updateUser = async (req, res) => {
    const userId = req.userId;
    const allowedFields = ["name", "email", "location", "bio", "skills", "causesSupported"];
    const updates = {};

    // Filter request body to only include allowed fields
    Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
            updates[key] = req.body[key];
        }
    });

    // Prevent empty update request
    if (Object.keys(updates).length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "No valid fields to update." });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, select: "-password" });
    if (!updatedUser) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found." });
    }

    return res.status(StatusCodes.OK).json({ user: updatedUser });
}