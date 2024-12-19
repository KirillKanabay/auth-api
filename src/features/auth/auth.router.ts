import {Router} from "../../framework/http/router";
import * as authController from './auth.controller';

const router = new Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

export default router;