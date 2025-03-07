import { Router } from "express";
import * as user from '../controllers/user.js';
import * as validator from '../validators.js';

const router = Router();

router.route('/login').post(
    validator.login,
    validator.validate,
    user.login
);

router.route('/register').post(
    validator.register,
    validator.validate,
    user.register
);

export default router;