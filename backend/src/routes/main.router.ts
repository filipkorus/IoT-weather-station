import {Router} from 'express';
import {HelloWorldHandler} from './main.controller';
import requireAuth from '../middlewares/requireAuth';
import nodeRouter from './gateway/gateway.router';
import authRouter from './auth/auth.router';
import userRouter from './user/user.router';

const router = Router();

router.use('/node', nodeRouter);
router.use('/auth', authRouter);
router.use('/user', requireAuth, userRouter);

router.get('/', HelloWorldHandler);

export default router;
