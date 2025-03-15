import { Router } from "express";
import * as helpRequest from "../controllers/helpRequest.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.route('/').post(
    authenticate,
    helpRequest.createHelpRequest
)

router.route('/').get(
    authenticate,
    helpRequest.getAllRequest
)

router.route('/:requestId').get(
    authenticate,
    helpRequest.getRequest
)

router.route('/:requestId/close').post(
    authenticate,
    helpRequest.closeRequest
)

export default router;