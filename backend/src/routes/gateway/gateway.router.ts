import {Router} from 'express';
import {InitGatewayHandler, GatewayPairingCodeHandler, CreateNodeHandler} from './gateway.controller';
import RequireAuth from '../../middlewares/requireAuth';
import requireGatewayAuth from '../../middlewares/requireGatewayAuth';

const router = Router();

router.post('/pariring-code', RequireAuth, GatewayPairingCodeHandler);

// endpoints for the Gateway itself
router.get('/init', requireGatewayAuth, InitGatewayHandler);
router.post('/create-node', requireGatewayAuth, CreateNodeHandler);

export default router;
