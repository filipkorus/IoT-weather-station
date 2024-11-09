import {
	FORBIDDEN,
	MISSING_BODY_FIELDS,
	NOT_FOUND,
	SERVER_ERROR,
	SUCCESS
} from '../../utils/httpCodeResponses/messages';
import {Request, Response} from 'express';
import {z} from 'zod';
import validateObject from '../../utils/validateObject';
import {
	createGatewayPairingCode,
	getGatewayById,
	getGatewayByPairingCode, getPairedGatewayPublicDataWithNodesAndLikes,
	getGatewaysByUserId,
	pairGatewayWithUserAccount, getPairedGateways, updateGatewayName, getGatewayLikesByGatewayIdUserAgentAndRemoteIp
} from './gateway.service';
import {getUserById} from '../user/user.service';
import {remoteIpAndUserAgent} from '../../utils/ws/wsRemoteIpAndUserAgent';

export const GetGatewayHandler = async (req: Request, res: Response) => {
	const gatewayId = req.params.id;
	if (gatewayId == null) { // return all gateways assigned to the user if no gateway ID is provided
		const gateways = await getGatewaysByUserId(res.locals.user.id);

		if (gateways == null) {
			return SERVER_ERROR(res, 'Server Error: Gateways could not be retrieved');
		}

		return SUCCESS(res, 'Gateways retrieved', {
			gateways: gateways.map(gateway => {
				const {apiKey, pairingCode, ...rest} = gateway;
				return rest;
			}
		)});
	}

	const gateway = await getGatewayById(gatewayId);
	if (gateway == null) {
		return NOT_FOUND(res, `Gateway (id=${gatewayId}) not found`);
	}

	const {apiKey, pairingCode, ...rest} = gateway;
	return SUCCESS(res, 'Gateway retrieved', {gateway: rest});
};

export const RenameGatewayHandler = async (req: Request, res: Response) => {
	const RequestSchema = z.object({
		name: z.string({required_error: 'Name is required'}).trim().min(3).max(50)
	});

	const validatedRequest = validateObject(RequestSchema, req.body);
	if (validatedRequest.data == null) {
		return MISSING_BODY_FIELDS(res, validatedRequest.errors);
	}

	const gatewayId = req.params.id;
	const gateway = await getGatewayById(gatewayId);
	if (gateway == null || gateway.userId !== res.locals.user.id) {
		return NOT_FOUND(res, `Gateway (id=${gatewayId}) not found`);
	}

	const updatedGateway = await updateGatewayName(gatewayId, validatedRequest.data.name);
	if (updatedGateway == null) {
		return SERVER_ERROR(res, 'Server Error: Gateway name could not be updated');
	}

	return SUCCESS(res, 'Gateway name updated', {name: updatedGateway.name});
};

export const GatewayPairingCodeHandler = async (req: Request, res: Response) => {
	const RequestSchema = z.object({
		pairingCode: z.string({required_error: 'Pairing code is required'}).trim().length(6).regex(/^\d{6}$/, { message: 'Pairing code must be a 6-digit number' })
	});

	const validatedRequest = validateObject(RequestSchema, req.body);
	if (validatedRequest.data == null) {
		return MISSING_BODY_FIELDS(res, validatedRequest.errors);
	}

	const gateway = await getGatewayByPairingCode(validatedRequest.data.pairingCode);
	if (gateway == null || gateway.isPaired) {
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

export const GetPublicGatewayDataHandler = async (req: Request, res: Response) => {
	const gatewayId = req.params.id;
	if (gatewayId == null) {
		// return all public gateways
		const gateways = await getPairedGateways();
		if (gateways == null) {
			return SERVER_ERROR(res, 'Server Error: Public gateways could not be retrieved');
		}

		const gatewaysDataPromise = await Promise.all(
			gateways.map(gateway => getPairedGatewayPublicDataWithNodesAndLikes(gateway.id))
		);

		const gatewaysData = gatewaysDataPromise.filter(gatewayData => gatewayData != null);
		return SUCCESS(res, 'Public gateways data retrieved', {gateways: gatewaysData});
	}

	const {ipAddr, userAgent} = remoteIpAndUserAgent(req);

	const gatewayDataPromise = getPairedGatewayPublicDataWithNodesAndLikes(gatewayId);
	const likePromise = getGatewayLikesByGatewayIdUserAgentAndRemoteIp({
		gatewayId,
		userAgent,
		ipAddr
	});
	const [gateway, like] = await Promise.all([gatewayDataPromise, likePromise]);
	if (gateway == null) {
		return NOT_FOUND(res, `Public gateway (id=${gatewayId}) not found`);
	}
	
	return SUCCESS(res, 'Public gateway data retrieved', {
		gateway: {
			...gateway,
			haveYouLiked: like != null
		}
	});
};

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
