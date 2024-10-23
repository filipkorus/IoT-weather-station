import {
	BAD_REQUEST, FORBIDDEN,
	MISSING_BODY_FIELDS,
	NOT_FOUND,
	SERVER_ERROR,
	SUCCESS
} from '../../utils/httpCodeResponses/messages';
import {Request, Response} from 'express';
import {z} from 'zod';
import validateObject from '../../utils/validateObject';
import {createNodePairingCode, getNodeById, getNodeByPairingCode, pairNodeWithUser} from './node.service';
import {getUserById} from '../user/user.service';

export const InitNodeHandler = async (req: Request, res: Response) => {
	const RequestSchema = z.object({
		uid: z.string({required_error: 'Node ID is required'}).trim()
	});

	const validatedRequest = validateObject(RequestSchema, req.body);
	if (validatedRequest.data == null) {
		return MISSING_BODY_FIELDS(res, validatedRequest.errors);
	}

	const node = await getNodeById(validatedRequest.data.uid);
	if (node == null) {
		return NOT_FOUND(res, `Node (id=${validatedRequest.data.uid}) not found`);
	}

	if (node.isPaired && node.userId != null) {
		const user = await getUserById(node.userId);
		if (user == null) {
			return SERVER_ERROR(res, `Server Error: User owning node (id=${validatedRequest.data.uid}) not found`);
		}

		return SUCCESS(res, `Node (id=${validatedRequest.data.uid}) is paired`, {username: user.username});
	}

	if (node.pairingCode != null) {
		return FORBIDDEN(res, 'Pairing code already exists', {pairingCode: node.pairingCode});
	}

	const updatedNode = await createNodePairingCode(node.id);
	if (updatedNode == null) {
		return SERVER_ERROR(res, 'Server Error: Pairing code could not be created');
	}

	return FORBIDDEN(res, 'Pairing code created', {pairingCode: updatedNode.pairingCode});
};

export const PairNodeHandler = async (req: Request, res: Response) => {
	const RequestSchema = z.object({
		pairingCode: z.string({required_error: 'Pairing code is required'}).trim().length(6)
	});

	const validatedRequest = validateObject(RequestSchema, req.body);
	if (validatedRequest.data == null) {
		return MISSING_BODY_FIELDS(res, validatedRequest.errors);
	}

	const node = await getNodeByPairingCode(validatedRequest.data.pairingCode);
	if (node == null) {
		return NOT_FOUND(res, 'Incorrect pairing code');
	}

	if (node.isPaired) {
		return NOT_FOUND(res, 'Incorrect pairing code');
	}

	const paired = await pairNodeWithUser({
		pairingCode: validatedRequest.data.pairingCode,
		userId: res.locals.user.id
	});

	if (paired == null) {
		return SERVER_ERROR(res, 'Server Error: Node could not be paired');
	}

	return SUCCESS(res, 'Node paired');
}
