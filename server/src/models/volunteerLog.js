import mongoose from "mongoose";
import * as constants from "../constants.js";

const VolunteerLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    hours: {
        type: Number,
        required: true,
        min: 0
    },
    peerVerifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

VolunteerLogSchema.virtual("verified").get(function () {
    return this.peerVerifications.length >= constants.PEER_VERIFICATION_COUNT;
  });

export default mongoose.model('VolunteerLog', VolunteerLogSchema);