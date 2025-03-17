import { Router } from "express";
import * as like from "../controllers/like.js"
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.route('/:commentId').post(
    authenticate,
    like.likeComment
)

export default router;