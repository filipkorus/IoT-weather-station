import {Router} from 'express';
import {GetPublicGatewayDataHandler} from './gateway.controller';

const router = Router();

router.get('/', GetPublicGatewayDataHandler);
router.get('/:id', GetPublicGatewayDataHandler);

export default router;
