import { StatusCodes } from 'http-status-codes';
import User from '../models/user.js';
import VolunteerLog from '../models/volunteerLog.js';
import * as constants from "../constants.js";
import mongoose from 'mongoose';

export const getUser = async (req, res) => {
    const user = await User.findById(req.userId).select("-password").lean();
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    const userStats = await VolunteerLog.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(user._id),
                $expr: { 
                    $gte: [{ $size: "$peerVerifications" }, constants.PEER_VERIFICATION_COUNT] 
                }
            }
        },
        {
            $addFields: {
                points: {
                    $multiply: ['$hours', constants.POINT_MULTIPLIER]
                }
            }
        },
        {
            $project: {
                hours: 1,
                points: 1
            }
        },
    ]);

    console.log(userStats)

    const userWithStates = {
        ...user,
        totalHours: userStats[0]?.hours || 0,
        points: userStats[0]?.points || 0
    }

    res.status(StatusCodes.OK).json(userWithStates);
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