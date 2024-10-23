import {Request, Response} from 'express';
import {SUCCESS} from '../../utils/httpCodeResponses/messages';

export const GetUserHandler = async (req: Request, res: Response) => {
	const {password, ...rest} = res.locals.user; // password hash cannot be sent to browser

	return SUCCESS(res, 'Success', {user: rest});
};
