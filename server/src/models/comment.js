import mongoose from "mongoose";


export const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    helpRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HelpRequest',
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    likes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model('Comment', CommentSchema);