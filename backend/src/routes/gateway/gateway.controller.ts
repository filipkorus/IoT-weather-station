import {
	BAD_REQUEST, CREATED, FORBIDDEN,
	MISSING_BODY_FIELDS,
	NOT_FOUND,
	SERVER_ERROR,
	SUCCESS
} from '../../utils/httpCodeResponses/messages';
import {Request, Response} from 'express';
import {z} from 'zod';
import validateObject from '../../utils/validateObject';
import {createGatewayPairingCode, getGatewayById, getGatewayByPairingCode, pairGatewayWithUserAccount} from './gateway.service';
import {getUserById} from '../user/user.service';
import {createNode} from './node.servcie';

export const GatewayPairingCodeHandler = async (req: Request, res: Response) => {
	const RequestSchema = z.object({
		pairingCode: z.string({required_error: 'Pairing code is required'}).trim().length(6)
	});

	const validatedRequest = validateObject(RequestSchema, req.body);
	if (validatedRequest.data == null) {
		return MISSING_BODY_FIELDS(res, validatedRequest.errors);
	}

	const gateway = await getGatewayByPairingCode(validatedRequest.data.pairingCode);
	if (gateway == null) {
		return NOT_FOUND(res, 'Incorrect pairing code');
	}

	if (gateway.isPaired) {
		return NOT_FOUND(res, 'Incorrect pairing code');
	}

	const paired = await pairGatewayWithUserAccount({
		pairingCode: validatedRequest.data.pairingCode,
		userId: res.locals.user.id
	});

	if (paired == null) {
		return SERVER_ERROR(res, 'Server Error: Gateway could not be paired');
	}

	return SUCCESS(res, 'Gateway paired');
}

export const InitGatewayHandler = async (req: Request, res: Response) => {
	const gatewayId = res.locals.gateway.id;
	const gateway = await getGatewayById(gatewayId);
	if (gateway == null) {
		return NOT_FOUND(res, `Gateway (id=${gatewayId}) not found`);
	}

	if (gateway.isPaired && gateway.userId != null) {
		const user = await getUserById(gateway.userId);
		if (user == null) {
			return SERVER_ERROR(res, `Server Error: User owning gateway (id=${gatewayId}) not found`);
		}

		return SUCCESS(res, `Gateway (id=${gatewayId}) is paired`, {username: user.username});
	}

	if (gateway.pairingCode != null) {
		return FORBIDDEN(res, 'Pairing code already exists', {pairingCode: gateway.pairingCode});
	}

	const updatedGateway = await createGatewayPairingCode(gateway.id);
	if (updatedGateway == null) {
		return SERVER_ERROR(res, 'Server Error: Pairing code could not be created');
	}

	return FORBIDDEN(res, 'Pairing code created', {pairingCode: updatedGateway.pairingCode});
};

export const CreateNodeHandler = async (req: Request, res: Response) => {
	const RequestSchema = z.object({
		id: z.string({required_error: 'Node ID is required'}).trim()
	});

	const validatedRequest = validateObject(RequestSchema, req.body);
	if (validatedRequest.data == null) {
		return MISSING_BODY_FIELDS(res, validatedRequest.errors);
	}

	const createdNode = await createNode({
		nodeId: validatedRequest.data.id,
		gatewayId: res.locals.gateway.id
	});
	if (createdNode == null) {
		return SERVER_ERROR(res, `Error: Node (id=${validatedRequest.data.id}) could not be created`);
	}

	return CREATED(res, 'Node created', {
		id: createdNode.id,
		name: createdNode.name,
		gatewayId: createdNode.gatewayId
	});
}
