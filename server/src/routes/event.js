import { Router } from 'express';
import * as event from '../controllers/event.js';
import * as volunteerLog from '../controllers/volunteerLog.js';
import * as validator from '../validators.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.route('/').post(
    authenticate,
    validator.createEvent,
    validator.validate,
    event.createEvent
);

router.route('/').get(
    authenticate,
    validator.eventFilters,
    validator.validate,
    event.getAllEvents
);

router.route('/attending').get(
    authenticate,
    event.getAttendingEvents,
);

router.route('/organized').get(
    authenticate,
    event.getOrganizedEvents,
);

router.route('/:eventId').get(
    validator.getEvent,
    validator.validate,
    authenticate,
    event.getEvent
);

router.route('/:eventId/join').post(
    validator.getEvent,
    validator.validate,
    authenticate,
    event.joinEvent
);

router.route('/:eventId/leave').post(
    validator.getEvent,
    validator.validate,
    authenticate,
    event.leaveEvent
);

router.route('/:eventId/log-hours').post(
    validator.getEvent,
    validator.validate,
    authenticate,
    volunteerLog.logHours
);

router.route('/:eventId/verifications').get(
    validator.getEvent,
    validator.validate,
    authenticate,
    volunteerLog.getVerifyRequests
);


export default router;