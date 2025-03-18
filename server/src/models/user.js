import mongoose from "mongoose";
import * as constants from '../constants.js'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    skills: {
        type: [String],
        default: []
    },
    causesSupport: {
        type: [String],
        enum: constants.CATEGORY,
        default: []
    }
});

export default mongoose.model('User', UserSchema);