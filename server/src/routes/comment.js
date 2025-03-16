import { Router } from "express";
import * as comment from "../controllers/comment.js";
import * as validator from "../validators.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router()

router.route('/:helpRequestId').post(
    authenticate,
    validator.createComment,
    validator.validate,
    comment.createComment
)

router.route('/:helpRequestId').get(
    authenticate,
    validator.getComment,
    validator.validate,
    comment.getComments
)

export default router;