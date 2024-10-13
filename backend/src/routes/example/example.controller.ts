import {Request, Response} from 'express';
import {SUCCESS} from '../../utils/httpCodeResponses/messages';
import {getExample} from './example.service';

export const GetExampleHandler = async (req: Request, res: Response) => {
	return SUCCESS(res, 'Success', {example: await getExample()});
};
