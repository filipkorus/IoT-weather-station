import {Router} from 'express';
import {
	GetGatewayHandler,
	InitGatewayHandler,
	GatewayPairingCodeHandler
} from './gateway.controller';
import RequireAuth from '../../middlewares/requireAuth';
import requireGatewayAuth from '../../middlewares/requireGatewayAuth';

const router = Router();

router.get('/', RequireAuth, GetGatewayHandler);
router.get('/:id', RequireAuth, GetGatewayHandler);
router.post('/pariring-code', RequireAuth, GatewayPairingCodeHandler);

// endpoints for the Gateway itself
router.post('/init', requireGatewayAuth, InitGatewayHandler);

export default router;