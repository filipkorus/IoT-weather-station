import {Router} from 'express';
import {HelloWorldHandler} from './main.controller';
import requireAuth from '../middlewares/requireAuth';
import gatewayRouter from './gateway/gateway.router';
import publicGatewayRouter from './gateway/publicGateway.router';
import authRouter from './auth/auth.router';
import userRouter from './user/user.router';
import measurementsRouter from './measurements/measurements.router';

const router = Router();

router.use('/gateway', gatewayRouter);
router.use('/public-gateway', publicGatewayRouter);
router.use('/auth', authRouter);
router.use('/user', requireAuth, userRouter);
router.use('/measurements', measurementsRouter);

router.get('/', HelloWorldHandler);

export default router;
