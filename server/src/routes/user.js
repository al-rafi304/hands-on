import { Router } from "express";
import * as user from '../controllers/user.js';

const router = Router();

router.route('/login').post(
    user.login
);

router.route('/register').post(
    user.register
);

export default router;