import { Router } from "express";
import * as like from "../controllers/like.js"
import * as validator from "../validators.js"
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.route('/:commentId').post(
    authenticate,
    validator.like,
    validator.validate,
    like.likeComment
)

router.route('/:commentId').delete(
    authenticate,
    validator.like,
    validator.validate,
    like.unlikeComment
)

export default router;