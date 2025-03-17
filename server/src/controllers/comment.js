import User from '../models/user.js';
import HelpRequest from '../models/helpRequest.js';
import Comment from '../models/comment.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

export const createComment = async (req, res) => {
    const helpRequestId = req.params.helpRequestId;
    const { text } = req.body;
    const userId = req.userId;

    if (!await User.exists({ _id: userId })) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid user ID" })
    }

    if (!await HelpRequest.exists({ _id: helpRequestId })) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Help Request not found" })
    }

    const comment = await Comment.create({
        helpRequest: helpRequestId,
        user: userId,
        text: text,
    });

    if (!comment) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Could not create comment" })
    }

    res.status(StatusCodes.CREATED).json({ comment })
}

export const getComments = async (req, res) => {
    const helpRequestId = req.params.helpRequestId;

    // const comments = await Comment.find({ helpRequest: helpRequestId }).populate('user', '_id name').sort({ createdAt: -1 });

    const comments = await Comment.aggregate([
        { $match: { helpRequest: new mongoose.Types.ObjectId(String(helpRequestId)) } },
        { $sort: { createdAt: -1 } },
        
        // Joining Likes and Comment 
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },

        // Summing the 'likes' array and overwriting it with the count
        {
            $addFields: {
                likes: { $size: "$likes" }
            }
        },

        // Joining Users and Comment
        // N.B: user field will contain an array
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",

                // Only selecting '_id', and 'name' field
                pipeline: [
                    {
                        $project: {
                            "_id": 1,
                            "name": 1
                        }
                    }
                ]
            }
        },

        // Deconstructing the 'user' field array
        {
            $unwind: "$user"
        }
    ])


    if (!comments) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid Help Request" })
    }

    res.status(StatusCodes.OK).json({ comments })
}