import { Gateway, Node, NodeData, PrismaClient } from "@prisma/client";
import logger from "../../utils/logger";
import generatePairingCode from "../../utils/generatePairingCode";

const prisma = new PrismaClient();

/**
 * Returns measurement for an individual node.
 *
 * @param nodeId ID of the node.
 * @param startDate - The start date of the measurement period (inclusive). Default is 7 days prior to the current date.
 * @param endDate - The end date of the measurement period (inclusive). Default is the current date.
 * @returns {NodeData[]} measurements for the node.
 */
const getMeasurementsByNodeId = async (
	nodeId: string,
	startDate?: Date,
	endDate?: Date
): Promise<NodeData[] | null> => {
	startDate = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Default to 7 days ago
	endDate = endDate || new Date(); // Default to now

	try {
		const nodeData = await prisma.nodeData.findMany({
			where: {
				nodeId: nodeId,
				created: {
					gte: startDate,
					lte: endDate,
				},
			},
		});
		return nodeData;
	} catch (error) {
		logger.error(error);
		return null;
	}
};

/**
 * Returns measurement for all nodes connected to the provided gateway.
 *
 * @param gatewayId ID of the gateway.
 * @param startDate - The start date of the measurement period (inclusive). Default is 7 days prior to the current date.
 * @param endDate - The end date of the measurement period (inclusive). Default is the current date.
 * @returns {NodeData[]} measurements for the gateway.
 */
const getMeasurementsByGatewayId = async (
	gatewayId: string,
	startDate?: Date,
	endDate?: Date
): Promise<NodeData[] | null> => {
	startDate = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Default to 7 days ago
	endDate = endDate || new Date(); // Default to now

	try {
		const nodes = await prisma.node.findMany({
			where: {
				gatewayId: gatewayId,
			},
		});

		const nodeData = await prisma.nodeData.findMany({
			where: {
				nodeId: {
					in: nodes.map((node) => node.id),
				},
				created: {
					gte: startDate,
					lte: endDate,
				},
			},
		});
		return nodeData;
	} catch (error) {
		logger.error(error);
		return null;
	}
};

export {
	getMeasurementsByNodeId,
	getMeasurementsByGatewayId
};
