import Like from "../models/like.js";
import Comment from "../models/comment.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";

export const likeComment = async (req, res) => {
    const commentId = req.params.commentId;

    if(!await User.exists({ _id: req.userId })) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized Access" });
    }

    if(!await Comment.exists({ _id: commentId })) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid comment id" });
    }

    try {
        await Like.create({
            user: req.userId,
            comment: commentId
        });
    } catch (err) {

        // Duplicate error code is 11000
        if (err.code === 11000) return res.status(StatusCodes.BAD_REQUEST).json({ error: "Already liked"})

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    }

    return res.status(StatusCodes.OK).json({ msg: "Like added" })
}

export const unlikeComment = async (req, res) => {
    const commentId = req.params.commentId;

    const like = await Like.findOneAndDelete({ user: req.userId, comment: commentId });
    if (!like) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Like not found" })
    }
    res.status(StatusCodes.OK).json({ msg: "Like removed" });
}