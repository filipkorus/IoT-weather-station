import {Router} from 'express';
import {
	GetGatewayHandler,
	InitGatewayHandler,
	GatewayPairingCodeHandler,
	GetPublicGatewayDataHandler
} from './gateway.controller';
import RequireAuth from '../../middlewares/requireAuth';
import requireGatewayAuth from '../../middlewares/requireGatewayAuth';

const router = Router();

router.get('/', RequireAuth, GetGatewayHandler);
router.get('/:id', RequireAuth, GetGatewayHandler);
router.post('/pariring-code', RequireAuth, GatewayPairingCodeHandler);

router.get('/public', GetPublicGatewayDataHandler);
router.get('/public/:id', GetPublicGatewayDataHandler);

// endpoints for the Gateway itself
router.post('/init', requireGatewayAuth, InitGatewayHandler);

export default router;
