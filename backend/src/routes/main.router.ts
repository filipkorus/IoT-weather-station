import {Router} from 'express';
import exampleRouter from './example/example.router';
import {HelloWorldHandler} from './main.controller';

const router = Router();

router.use('/example', exampleRouter);

router.get('/', HelloWorldHandler);

export default router;
