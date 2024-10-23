import {Node, NodeData, PrismaClient} from "@prisma/client";
import logger from '../../utils/logger';
import generatePairingCode from '../../utils/generatePairingCode';

const prisma = new PrismaClient();

/**
 * Returns node by its API key.
 *
 * @param apiKey API key of the node.
 * @returns Node object if found, otherwise null.
 */
const getNodeByApiKey = async (apiKey: string): Promise<Node | null> => {
	if (apiKey == '') {
		return null;
	}

	try {
		return prisma.node.findFirst({
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
 * Returns node by its ID.
 *
 * @param nodeId ID of the node.
 * @returns Node object if found, otherwise null.
 */
const getNodeById = async (nodeId: string): Promise<Node | null> => {
	try {
		return prisma.node.findFirst({
			where: {id: nodeId}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Sets node's online status.
 *
 * @param nodeId ID of the node.
 * @param isOnline Boolean indicating if node is online.
 */
const setNodeIsOnline = async (nodeId: string, isOnline: boolean): Promise<void> => {
	try {
		await prisma.node.update({where: {id: nodeId}, data: {isOnline, lastOnline: new Date()}});
	} catch (error) {
		logger.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Creates pairing code for node.
 *
 * @param nodeId ID of the node.
 * @returns Node Node object with pairing code if successful, otherwise null.
 */
const createNodePairingCode = async (nodeId: string) => {
	const node = await getNodeById(nodeId);

	if (node == null) {
		logger.debug(`Node (id=${nodeId}) not found`);
		return null;
	}

	if (node.isPaired) {
		logger.debug(`Node (id=${nodeId}) is already paired`);
		return null;
	}

	let pairingCode: string = generatePairingCode();
	while (await checkIfPairingCodeExists(pairingCode)) {
		pairingCode = generatePairingCode();
	}

	try {
		return prisma.node.update({
			data: {pairingCode},
			where: {id: node.id}
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
		return (await prisma.node.count({
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
 * Returns node by its pairing code.
 *
 * @param pairingCode Pairing code of the node.
 * @returns Node object if found, otherwise null.
 */
const getNodeByPairingCode = async (pairingCode: string) => {
	try {
		return prisma.node.findFirst({
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
 * Pairs node with user.
 *
 * @param pairingCode Pairing code of the node.
 * @param userId ID of the user.
 * @returns Boolean Boolean indicating if pairing was successful.
 */
const pairNodeWithUser = async ({pairingCode, userId}: { pairingCode: string, userId: number }) => {
	try {
		const updatedNode = await prisma.node.update({
			data: {userId, isPaired: true, pairingCode: null},
			where: {pairingCode}
		});
		return updatedNode.isPaired;
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

type NodeDataToSave = Pick<NodeData, 'temperature' | 'humidity' | 'pressure' | 'snowDepth' | 'pm1' | 'pm25' | 'pm10'>;
/**
 * Saves node data to the database.
 * @param nodeId ID of the node.
 * @param data Data to save.
 */
const saveNodeData = async (nodeId: string, data: NodeDataToSave) => {
	try {
		await prisma.nodeData.create({
			data: {
				nodeId,
				...data
			}
		});
	} catch (error) {
		logger.error(error);
	} finally {
		await prisma.$disconnect();
	}
}

/**
 * Saves node like to the database.
 * @param nodeId ID of the node.
 * @param likeData Data to save.
 */
const saveNodeLike = async ({nodeId, likeData}: { nodeId: string, likeData: {ipAddr: string, remotePort: number, userAgent: string} }) => {
	try {
		await prisma.nodeLike.create({
			data: {
				nodeId,
				ipAddr: likeData.ipAddr,
				remotePort: likeData.remotePort,
				userAgent: likeData.userAgent
			}
		});
		return true;
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Returns node likes by node ID, user agent, IP address and remote port.
 * @param nodeId ID of the node.
 * @param userAgent User agent string.
 * @param ipAddr IP address.
 * @param remotePort Remote port.
 */
const getNodeLikesByNodeIdUserAgentIpAndPort = async (
	{nodeId, userAgent, ipAddr, remotePort}:
		{nodeId: string, userAgent: string, ipAddr: string, remotePort: number}
) => {
	try {
		return prisma.nodeLike.findMany({
			where: {
				nodeId,
				userAgent,
				ipAddr,
				remotePort
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
 * Counts node likes by node ID.
 * @param nodeId ID of the node.
 */
const countNodeLikesByNodeId = async (nodeId: string) => {
	try {
		return prisma.nodeLike.count({
			where: {nodeId}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};

export {
	getNodeByApiKey,
	getNodeById,
	setNodeIsOnline,
	createNodePairingCode,
	getNodeByPairingCode,
	pairNodeWithUser,
	saveNodeData,
	saveNodeLike,
	getNodeLikesByNodeIdUserAgentIpAndPort,
	countNodeLikesByNodeId
};
