import {
	BAD_REQUEST, CONFLICT, CREATED,
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
	getGatewayByPairingCode,
	getPairedGatewayPublicDataWithNodesAndLikes,
	getGatewaysByUserId,
	pairGatewayWithUserAccount,
	getPairedGateways,
	updateGatewayName,
	getGatewayLikesByGatewayIdUserAgentAndRemoteIp,
	getLastNGatewaySensorDataRecords, updateGatewayLocation, createGateway
} from './gateway.service';
import {getUserById} from '../user/user.service';
import {remoteIpAndUserAgent} from '../../utils/ws/wsRemoteIpAndUserAgent';
import generateApiKey from '../../utils/generateApiKey';

export const CreateGatewayHandler = async (req: Request, res: Response) => {
	const RequestSchema = z.object({
		gatewayId: z.string().trim().length(11)
	});

	const validatedRequest = validateObject(RequestSchema, req.body);
	if (validatedRequest.data == null) {
		return MISSING_BODY_FIELDS(res, validatedRequest.errors);
	}

	const gatewayId = validatedRequest.data.gatewayId;

	const existingGateway = await getGatewayById(gatewayId);
	if (existingGateway != null) {
		return CONFLICT(res, `Gateway with id=${gatewayId} already exists`, {gatewayId});
	}

	const gatewayApiKey = generateApiKey();
	const gateway = await createGateway({
		gatewayId,
		apiKey: gatewayApiKey
	})

	if (gateway == null) {
		return SERVER_ERROR(res, 'Server Error: Gateway could not be created');
	}

	return CREATED(res, 'Gateway created', {gateway: {
		gatewayId: gateway.id,
		apiKey: gateway.apiKey
	}});
};

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

export const UpdateGatewayHandler = async (req: Request, res: Response) => {
	const RequestSchema = z.object({
		name: z.string().trim().min(3).max(50).optional(),
		latitude: z.number().min(-90).max(90).optional(),
		longitude: z.number().min(-180).max(180).optional()
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

	let updatedNameGateway;
	if (validatedRequest.data.name != null && validatedRequest.data.name !== gateway.name) {
		updatedNameGateway = await updateGatewayName(gatewayId, validatedRequest.data.name);
	}

	let updatedLocationGateway;
	if (validatedRequest.data.latitude != null && validatedRequest.data.longitude != null) {
		updatedLocationGateway = await updateGatewayLocation(gatewayId, {
			latitude: validatedRequest.data.latitude,
			longitude: validatedRequest.data.longitude
		});
	}

	if (updatedNameGateway == null && updatedLocationGateway == null) {
		return SUCCESS(res, 'No changes made');
	}

	if (updatedLocationGateway != null && updatedNameGateway != null) {
		return SUCCESS(res, 'Gateway name and location updated', {
			name: updatedNameGateway.name,
			latitude: updatedLocationGateway.latitude,
			longitude: updatedLocationGateway.longitude
		});
	}

	if (updatedLocationGateway != null) {
		return SUCCESS(res, 'Gateway location updated', {
			latitude: updatedLocationGateway.latitude,
			longitude: updatedLocationGateway.longitude
		});
	}

	if (updatedNameGateway != null) {
		return SUCCESS(res, 'Gateway name updated', {name: updatedNameGateway.name});
	}

	return BAD_REQUEST(res, 'No changes made');
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
	const {ipAddr, userAgent} = remoteIpAndUserAgent(req);

	if (gatewayId == null) {
		// return all public gateways
		const gateways = await getPairedGateways();
		if (gateways == null) {
			return SERVER_ERROR(res, 'Server Error: Public gateways could not be retrieved');
		}

		const gatewaysDataPromise = Promise.all(
			gateways.map(gateway => getPairedGatewayPublicDataWithNodesAndLikes(gateway.id))
		);
		const likePromise = Promise.all(
			gateways.map(gateway => getGatewayLikesByGatewayIdUserAgentAndRemoteIp({
				gatewayId: gateway.id,
				userAgent,
				ipAddr
			}))
		);
		const gatewaySensorDataPromise = Promise.all(
			gateways.map(gateway => getLastNGatewaySensorDataRecords(gateway.id))
		);

		const [gatewaysData, like, gatewaySensorData] = await Promise.all([gatewaysDataPromise, likePromise, gatewaySensorDataPromise]);

		const gatewaysDataWithSensorData = gatewaysData
				.filter((gatewayData, idx) => gatewayData != null && gatewaySensorData[idx] != null && like[idx] !== null)
				.map((gatewayData, index) => {
					return {
						...gatewayData,
						haveYouLiked: like[index] !== null && like[index] !== 0,
						sensorData: gatewaySensorData[index]
					};
				});

		return SUCCESS(res, 'Public gateways data retrieved', {gateways: gatewaysDataWithSensorData});
	}

	const gatewayDataPromise = getPairedGatewayPublicDataWithNodesAndLikes(gatewayId);
	const likePromise = getGatewayLikesByGatewayIdUserAgentAndRemoteIp({
		gatewayId,
		userAgent,
		ipAddr
	});
	const gatewaySensorDataPromise = getLastNGatewaySensorDataRecords(gatewayId);
	const [gateway, like, gatewaySensorData] = await Promise.all([gatewayDataPromise, likePromise, gatewaySensorDataPromise]);
	if (gateway == null) {
		return NOT_FOUND(res, `Public gateway (id=${gatewayId}) not found`);
	}
	
	return SUCCESS(res, 'Public gateway data retrieved', {
		gateway: {
			...gateway,
			haveYouLiked: like !== null && like !== 0,
			sensorData: gatewaySensorData
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
