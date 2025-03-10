import { Router } from 'express';
import * as event from '../controllers/event.js';
import * as validator from '../validators.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.route('/').post(
    authenticate,
    validator.createEvent,
    validator.validate,
    event.createEvent
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
)

export default router;