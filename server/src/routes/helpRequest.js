import { Router } from "express";
import * as helpRequest from "../controllers/helpRequest.js";
import * as validator from "../validators.js"
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.route('/').post(
    authenticate,
    validator.createRequest,
    validator.validate,
    helpRequest.createHelpRequest
)

router.route('/').get(
    authenticate,
    validator.requestFilters,
    validator.validate,
    helpRequest.getAllRequest
)

router.route('/:requestId').get(
    authenticate,
    validator.getRequest,
    validator.validate,
    helpRequest.getRequest
)

router.route('/:requestId/close').post(
    authenticate,
    helpRequest.closeRequest
)

export default router;