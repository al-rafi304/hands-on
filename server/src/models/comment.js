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
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    }
}, {
    timestamps: true
});

export default mongoose.model('Comment', CommentSchema);