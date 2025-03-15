import User from "../models/user.js";
import HelpRequest from "../models/helpRequest.js";
import { StatusCodes } from "http-status-codes";

export const createHelpRequest = async (req, res) => {
    const {
        title,
        description,
        location,
        category,
        urgency
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const helpRequest = await HelpRequest.create({
        user: user,
        title: title,
        description: description,
        location: location,
        category: category,
        urgency: urgency
    });

    res.status(StatusCodes.CREATED).json({ helpRequest })
}

export const getAllRequest = async (req, res) => {
    const { category, location, open, startDate, endDate } = req.query;
    var filter = {};

    if (category) {
        filter.category = category;
    }
    if (location) {
        filter.location = { $regex: location, $options: "i" };
    }
    if (open) {
        filter.is_open = open
    }
    if (startDate || endDate) {
        filter.createdAt = {}
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const helpRequests = await HelpRequest.find(filter).populate('user', '_id name');
    if (!helpRequests) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Help requests not found" });
    }

    res.status(StatusCodes.OK).json({ helpRequests });
}

export const getRequest = async (req, res) => {
    const requestId = req.params.requestId;
    const helpRequest = await HelpRequest.findById(requestId).populate('user', '_id name');
    if (!helpRequest) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Help request not found" });
    }

    res.status(StatusCodes.OK).json({ helpRequest });
}

// export const updateStatus = async (req, res) => {
//     const requestId = req.params.requestId;
//     const status = req.body.open;

//     const helpRequest = await HelpRequest.findOneAndUpdate(
//         {
//             _id: requestId,
//             user: req.userId 
//         },
//         {
//             is_open: status
//         },
//         {
//             new: true
//         }
//     )

//     if (!helpRequest) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ error: "Help request could not be updated" });
//     }

//     helpRequest.status = status;
//     await helpRequest.save();

//     res.status(StatusCodes.OK).json({ helpRequest });
// }

export const closeRequest = async (req, res) => {
    const requestId = req.params.requestId;

    const helpRequest = await HelpRequest.findOneAndUpdate(
        {
            _id: requestId,
            user: req.userId
        },
        {
            is_open: false
        },
        {
            new: true
        }
    )

    if (!helpRequest) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Help request could not be closed" })
    }

    res.status(StatusCodes.OK).json({ msg: "Closed request" })
}