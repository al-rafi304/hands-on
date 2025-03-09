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