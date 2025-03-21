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
    const event = await Event.findById(eventId).populate('organizer', '_id name');
    if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" });
    }

    res.status(StatusCodes.OK).json({ event });
}

export const getAllEvents = async (req, res) => {
    const { category, location, startDate, endDate } = req.query;
    var filter = {};

    if (category) {
        filter.category = category;
    }
    if (location) {
        filter.location = { $regex: location, $options: "i" };
    }
    if (startDate || endDate) {
        filter.date = {}
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    const events = await Event.find(filter).populate('organizer', '_id name');

    res.status(StatusCodes.OK).json({ events });
}

export const joinEvent = async (req, res) => {
    const eventId = req.params.eventId;

    const event = await Event.findOneAndUpdate(
        {
            _id: eventId,
            attending: { $nin: [req.userId] },
            date: { $gte: new Date() }
        },
        { $push: { attending: req.userId } },
        { new: true }
    );

    if (!event) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Unable to join event" });
    }

    res.status(StatusCodes.OK).json({ msg: "User joined event!" });
}

export const leaveEvent = async (req, res) => {
    const eventId = req.params.eventId;

    const event = await Event.findOneAndUpdate(
        {
            _id: eventId,
            attending: { $in: [req.userId] },
            date: { $gte: new Date() }
        },
        { $pull: { attending: req.userId } },
        { new: true }
    );

    if (!event) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Unable to leave event" });
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

export const getOrganizedEvents = async (req, res) => {
    const userId = req.userId;

    const events = await Event.find({ organizer: userId });
    if (!events) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "No events found" });
    }

    res.status(StatusCodes.OK).json({ events });
}