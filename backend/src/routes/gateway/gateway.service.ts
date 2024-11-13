import {Gateway, Node, NodeData, PrismaClient} from "@prisma/client";
import logger from '../../utils/logger';
import generatePairingCode from '../../utils/generatePairingCode';

const prisma = new PrismaClient();

/**
 * Creates gateway in the database.
 *
 * @param apiKey API key of the gateway.
 * @param gatewayId ID of the gateway.
 * @returns Gateway Gateway object if successful, otherwise null.
 */
const createGateway = async ({apiKey, gatewayId}: {apiKey: string, gatewayId: string}): Promise<Gateway | null> => {
	try {
		return prisma.gateway.create({
			data: {
				id: gatewayId,
				apiKey
			}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
}

/**
 * Updates gateway name in the database.
 *
 * @param gatewayId ID of the gateway.
 * @param name New name of the gateway.
 * @returns Gateway Gateway object if successful, otherwise null.
 */
const updateGatewayName = async (gatewayId: string, name: string): Promise<Gateway | null> => {
	try {
		return prisma.gateway.update({
			data: {name},
			where: {id: gatewayId}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Returns gateway by its API key.
 *
 * @param apiKey API key of the gateway.
 * @returns Node object if found, otherwise null.
 */
const getGatewayByApiKey = async (apiKey: string): Promise<Gateway | null> => {
	if (apiKey == '') {
		return null;
	}

	try {
		return prisma.gateway.findFirst({
			where: {apiKey}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Returns Gateway by its ID.
 *
 * @param gatewayId ID of the gateway.
 * @returns Gateway Gateway object if found, otherwise null.
 */
const getGatewayById = async (gatewayId: string): Promise<Gateway | null> => {
	try {
		return prisma.gateway.findFirst({
			where: {id: gatewayId}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Returns gateways by user ID.
 *
 * @param userId ID of the user.
 * @returns Gateway[] Array of Gateway objects if found, otherwise null.
 */
const getGatewaysByUserId = async (userId: number): Promise<Gateway[] | null> => {
	try {
		return prisma.gateway.findMany({
			where: {userId},
			orderBy: {lastOnline: 'desc'},
			include: {nodes: true}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
}

/**
 * Sets gateway's online status.
 *
 * @param gatewayId ID of the node.
 * @param isOnline Boolean indicating if gateway is online.
 */
const setGatewayIsOnline = async (gatewayId: string, isOnline: boolean): Promise<void> => {
	try {
		const updateIsOnlinePromise = prisma.gateway.update({where: {id: gatewayId}, data: {isOnline, lastOnline: new Date()}});
		const updateLastOnlinePromise = prisma.gateway.update({where: {id: gatewayId}, data: {lastOnline: new Date()}});
		if (isOnline) {
			await Promise.all([updateIsOnlinePromise]);
		} else {
			await Promise.all([updateIsOnlinePromise, updateLastOnlinePromise]);
		}
	} catch (error) {
		logger.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Creates pairing code for a gateway.
 *
 * @param gatewayId ID of the gateway.
 * @returns Gateway Gateway object with pairing code if successful, otherwise null.
 */
const createGatewayPairingCode = async (gatewayId: string) => {
	const gateway = await getGatewayById(gatewayId);

	if (gateway == null) {
		logger.debug(`Gateway (id=${gatewayId}) not found`);
		return null;
	}

	if (gateway.isPaired) {
		logger.debug(`Gateway (id=${gatewayId}) is already paired`);
		return null;
	}

	let pairingCode: string = generatePairingCode();
	while (await checkIfPairingCodeExists(pairingCode)) {
		pairingCode = generatePairingCode();
	}

	try {
		return prisma.gateway.update({
			data: {pairingCode},
			where: {id: gateway.id}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Checks if pairing code exists in the database.
 * @param pairingCode Pairing code to check.
 */
const checkIfPairingCodeExists = async (pairingCode: string) => {
	try {
		return (await prisma.gateway.count({
			where: {pairingCode}
		})) > 0;
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Returns gateway by its pairing code.
 *
 * @param pairingCode Pairing code of the gateway.
 * @returns Gateway Gateway object if found, otherwise null.
 */
const getGatewayByPairingCode = async (pairingCode: string) => {
	try {
		return prisma.gateway.findFirst({
			where: {pairingCode}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Pairs gateway with user.
 *
 * @param pairingCode Pairing code of the node.
 * @param userId ID of the user.
 * @returns Boolean Boolean indicating if pairing was successful.
 */
const pairGatewayWithUserAccount = async ({pairingCode, userId}: { pairingCode: string, userId: number }) => {
	try {
		const updatedGateway = await prisma.gateway.update({
			data: {userId, isPaired: true, pairingCode: null},
			where: {pairingCode}
		});
		return updatedGateway.isPaired;
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Saves gateway like to the database.
 * @param gatewayId ID of the gateway.
 * @param likeData Data to save.
 */
const saveGatewayLike = async ({gatewayId, likeData}: { gatewayId: string, likeData: {ipAddr: string, userAgent: string} }) => {
	try {
		const saved = await prisma.gatewayLike.create({
			data: {
				gatewayId,
				ipAddr: likeData.ipAddr,
				userAgent: likeData.userAgent
			}
		});
		return saved != null;
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Removes gateway like from the database.
 * @param likeId ID of the like.
 * @returns Boolean Boolean indicating if like was removed.
 */
const removeGatewayLike = async (likeId: number) => {
	try {
		const deleted = await prisma.gatewayLike.delete({
			where: {
				id: likeId
			}
		});
		return deleted != null;
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Returns node likes by node ID, user agent and IP address from current day.
 * @param nodeId ID of the node.
 * @param userAgent User agent string.
 * @param ipAddr IP address.
 */
const getGatewayLikesByGatewayIdUserAgentAndRemoteIp = async (
	{gatewayId, userAgent, ipAddr}:
		{gatewayId: string, userAgent: string, ipAddr: string}
) => {
	try {
		const gateway = await getGatewayById(gatewayId);
		if (gateway == null || !gateway.isPaired) {
			return null;
		}
		return prisma.gatewayLike.findMany({
			where: {
				gatewayId,
				userAgent,
				ipAddr,
				created: { // ensure that the like was made today
					gte: new Date(new Date().setHours(0, 0, 0, 0)),
					lte: new Date(new Date().setHours(23, 59, 59, 999))
				}
			}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Counts gateway likes by gateway ID from current day.
 * @param gatewayId ID of the gateway.
 */
const countGatewayLikesByGatewayId = async (gatewayId: string) => {
	try {
		return prisma.gatewayLike.count({where: {
			gatewayId,
			created: { // check if current day is the same as the day of the like
				gte: new Date(new Date().setHours(0, 0, 0, 0)),
				lte: new Date(new Date().setHours(23, 59, 59, 999))
			}
		}});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Returns paired gateway public data with nodes and like count by gateway ID.
 * @param gatewayId ID of the gateway.
 * @returns Gateway Gateway object with nodes and like count if successful, otherwise null.
 */
const getPairedGatewayPublicDataWithNodesAndLikes = async (gatewayId: string) => {
	try {
		const gatewayPromise = prisma.gateway.findFirst({
			where: {id: gatewayId, isPaired: true},
			include: {nodes: true}
		});
		const likesPromise = countGatewayLikesByGatewayId(gatewayId);
		const [gateway, likes] = await Promise.all([gatewayPromise, likesPromise]);

		if (gateway == null) {
			return null;
		}

		const {apiKey, pairingCode, ...rest} = gateway;
		return {
			...rest,
			likes: likes ?? 0,
			haveYouLiked: false
		};
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Returns gateway sensor data.
 * @param gatewayId ID of the gateway.
 * @param recordsLimit Number of records to return.
 * @returns NodeData[] Array of NodeData objects if successful, otherwise null.
 */
const getLastNGatewaySensorDataRecords = async (gatewayId: string, recordsLimit: number = 5): Promise<NodeData[] | null> => {
	try {
		return prisma.nodeData.findMany({
			where: {
				Node: {
					gatewayId: gatewayId,
				},
			},
			orderBy: {
				created: 'desc',
			},
			take: recordsLimit,
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
}

/**
 * Returns all paired gateways.
 * @returns Gateway[] Array of Gateway objects if successful, otherwise null.
 */
const getPairedGateways = async () => {
	try {
		return prisma.gateway.findMany({
			where: {isPaired: true},
			select: {id: true, name: true, isOnline: true, lastOnline: true}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
}

export {
	createGateway,
	updateGatewayName,
	getGatewayByApiKey,
	getGatewayById,
	getGatewaysByUserId,
	setGatewayIsOnline,
	createGatewayPairingCode,
	getGatewayByPairingCode,
	pairGatewayWithUserAccount,
	saveGatewayLike,
	removeGatewayLike,
	getGatewayLikesByGatewayIdUserAgentAndRemoteIp,
	countGatewayLikesByGatewayId,
	getPairedGatewayPublicDataWithNodesAndLikes,
	getLastNGatewaySensorDataRecords,
	getPairedGateways
};
