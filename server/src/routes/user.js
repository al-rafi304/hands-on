import { Router } from "express";
import * as user from '../controllers/user.js';
import * as validator from '../validators.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.route('/').get(
    authenticate,
    user.getUser
);
router.route('/').patch(
    authenticate,
    validator.updateUser,
    validator.validate,
    user.updateUser
);

export default router;