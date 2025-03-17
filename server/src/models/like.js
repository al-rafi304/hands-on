import mongoose from 'mongoose';

const LikeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        require: true
    }
}, { timestamps: true});

LikeSchema.index({ user: 1, comment: 1 }, { unique: true })

export default mongoose.model('Like', LikeSchema);