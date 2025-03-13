import User from '../models/user.js';
import Event from '../models/event.js';
import { StatusCodes } from 'http-status-codes';

export const createEvent = async (req, res) => {
    const {
        title,
        description,
        date,
        location,
        category
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    const event = await Event.create({
        organizer: user,
        title: title,
        description: description,
        date: date,
        location: location,
        category: category
    });

    res.status(StatusCodes.CREATED).json({ event_id: event._id });
}

export const getEvent = async (req, res) => {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" });
    }

    res.status(StatusCodes.OK).json({ event });
}

export const joinEvent = async (req, res) => {
    const eventId = req.params.eventId;

    const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $addToSet: { attending: req.userId } }, // $addToSet ensures no duplicates
        { new: true }
    ).select("attending");

    if (!updatedEvent) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" });
    }

    res.status(StatusCodes.OK).json({ msg: "User joined event!" });
}

export const leaveEvent = async (req, res) => {
    const eventId = req.params.eventId;

    const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $pull: { attending: req.userId } },
        { new: true }
    ).select("attending");

    if (!updatedEvent) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" });
    }

    res.status(StatusCodes.OK).json({ msg: "User left event!" });
}

export const getAttendingEvents = async (req, res) => {
    const userId = req.userId;

    const events = await Event.find({ attending: { $in: [userId] } });
    if (!events) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "No events found" });
    }

    res.status(StatusCodes.OK).json({ events });
}