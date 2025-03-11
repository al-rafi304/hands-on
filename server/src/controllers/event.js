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

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    if (event.attending.includes(user._id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "User already attending event" });
    }

    event.attending.push(user);
    await event.save();

    res.status(StatusCodes.OK).json({ msg: "User joined event!" });
}

export const leaveEvent = async (req, res) => {
    const eventId = req.params.eventId;

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    await Event.findByIdAndUpdate(
        eventId,
        { $pull: { attending: user._id } },
        { new: true }
    ).select("attending");

    res.status(StatusCodes.OK).json({ msg: "User left event!" });
}