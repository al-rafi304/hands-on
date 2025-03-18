import VolunteerLog from "../models/volunteerLog.js";
import Event from "../models/event.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import mongoose from "mongoose";

export const logHours = async (req, res) => {
    const { hours } = req.body;
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" });
    }

    if (!await User.exists({ _id: req.userId })) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    try {
        const log = await VolunteerLog.create({
            user: req.userId,
            event: eventId,
            hours: hours
        })

        if (!log) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Could not log hours!" });
        }

        res.status(StatusCodes.CREATED).json({ id: log._id });

    } catch (err) {
        if (err.code === 11000) return res.status(StatusCodes.BAD_REQUEST).json({ error: "Already logged" })
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    }
}

export const getVerifyRequests = async (req, res) => {
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" });
    }

    // const logs = await VolunteerLog.find({ event: eventId }).populate('user', '_id name');

    const logs = await VolunteerLog.aggregate([
        { $match: { event: new mongoose.Types.ObjectId(eventId) } },
        {
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'user',
                as: 'user',
                pipeline: [{
                    $project: {
                        "_id": 1,
                        "name": 1
                    }
                }]
            }
        },
        {
            $unwind: "$user"
        },
        { $addFields: {
            hasVerified: {
                $cond: {
                    if: { $in: [new mongoose.Types.ObjectId(String(req.userId)), "$peerVerifications"] },
                    then: true,
                    else: false
                }
            }
        } }
    ])

    if (!logs) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Logs not found" });
    }

    res.status(StatusCodes.OK).json({ logs });
}

export const verifyhours = async (req, res) => {
    const logId = req.params.logId;
    const userId = req.userId;

    const log = await VolunteerLog.findById(logId);
    if (!log) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Log not found" });
    }

    if (log.peerVerifications.includes(userId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Already verified" });
    }

    log.peerVerifications.push(userId);
    await log.save();

    res.status(StatusCodes.OK).json({ msg: "Peer Verification successful" });
}
