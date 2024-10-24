import {NextFunction, Response, Request} from 'express';
import {UNAUTHORIZED} from '../utils/httpCodeResponses/messages';

const requireGatewayAuth = async (req: Request, res: Response, next: NextFunction) => {
	if (res.locals.gatewayAuthenticated) {
		return next();
	}

	return UNAUTHORIZED(res);
};

export default requireGatewayAuth;
