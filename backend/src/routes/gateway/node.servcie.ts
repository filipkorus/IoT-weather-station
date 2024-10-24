import {Node, NodeData, PrismaClient} from '@prisma/client';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

/**
 * Creates a node in the database.
 * @param gatewayId ID of the gateway.
 * @param nodeId ID of the node.
 * @returns {Promise<Node|null>} Created node.
 */
const createNode = async ({gatewayId, nodeId}: {gatewayId: string, nodeId: string}): Promise<Node | null> => {
	try {
		return prisma.node.create({
			data: {
				id: nodeId,
				gatewayId
			}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
}

type NodeDataToSave = Pick<NodeData, 'temperature' | 'humidity' | 'pressure' | 'snowDepth' | 'pm1' | 'pm25' | 'pm10'>;
/**
 * Saves node data to the database.
 * @param nodeId ID of the node.
 * @param data Data to save.
 */
const saveNodeData = async ({nodeId, data}: {nodeId: string, data: NodeDataToSave}) => {
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

export {
	createNode,
	saveNodeData
};
