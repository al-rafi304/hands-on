import { Router } from "express";
import * as volunteerLog from "../controllers/volunteerLog.js";
import * as validator from "../validators.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.route('/:logId/verify').post(
    authenticate,
    volunteerLog.verifyhours
);

export default router;