import mongoose from 'mongoose';
import * as constants from '../constants.js';

export const HelpRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: constants.CATEGORY,
    },
    urgency: {
        type: String,
        enum: constants.URGENCY,
        required: true,
    },
    is_open: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('HelpRequest', HelpRequestSchema);