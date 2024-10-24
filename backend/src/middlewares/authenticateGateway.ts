import {NextFunction, Response, Request} from 'express';
import {getGatewayByApiKey} from '../routes/gateway/gateway.service';

const authenticateGateway = async (req: Request, res: Response, next: NextFunction) => {
	const apiKey = req.header('Authorization');

	if (apiKey == null) {
		return next();
	}

	const gateway = await getGatewayByApiKey(apiKey);
	if (gateway == null) {
		return next();
	}

	res.locals.gatewayAuthenticated = true;
	res.locals.gateway = gateway;
	next();
};

export default authenticateGateway;
