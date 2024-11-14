import {Router} from 'express';
import { GetMeasurementsHandler } from './measurements.controller';

const router = Router();

router.get('/node/:id', GetMeasurementsHandler);
router.get('/gateway/:id', GetMeasurementsHandler);



export default router;
