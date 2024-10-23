import {Router} from 'express';
import {InitNodeHandler, PairNodeHandler} from './node.controller';
import RequireAuth from '../../middlewares/requireAuth';

const router = Router();

router.post('/pair', RequireAuth, PairNodeHandler);

// endpoint for the Node to display pairing code
router.get('/init', InitNodeHandler);

export default router;
