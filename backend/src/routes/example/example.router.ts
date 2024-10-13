import {Router} from 'express';
import {GetExampleHandler} from './example.controller';

const router = Router();

router.get('/', GetExampleHandler);

export default router;
