import {NextFunction, Request, Response} from 'express';
import {UNAUTHORIZED} from '../utils/httpCodeResponses/messages';
import config from '../../config';

const requireVendorAuth = async (req: Request, res: Response, next: NextFunction) => {
	const apiKey = req.header('Authorization');
	if (apiKey == null || apiKey !== config.VENDOR_API_KEY) {
		return UNAUTHORIZED(res);
	}

	next();
};

export default requireVendorAuth;
