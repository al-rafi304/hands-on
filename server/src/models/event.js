import mongoose from 'mongoose';
import * as constants from '../constants.js'

export const EventSchema = new mongoose.Schema({
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attending: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
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
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: [String],
        required: true,
        enum: constants.CATEGORY,
        default: []
    },

}, { timestamps: true });