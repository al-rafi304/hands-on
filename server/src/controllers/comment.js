import User from '../models/user.js';
import HelpRequest from '../models/helpRequest.js';
import Comment from '../models/comment.js';
import { StatusCodes } from 'http-status-codes';

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

    res.status(StatusCodes.CREATED).json({ comment_id: comment._id })
}

export const getComments = async (req, res) => {
    const helpRequestId = req.params.helpRequestId;

    const comments = await Comment.find({ helpRequest: helpRequestId }).populate('user', '_id name');
    if (!comments) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid Help Request" })
    }

    res.status(StatusCodes.OK).json({ comments })
}