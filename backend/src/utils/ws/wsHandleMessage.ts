import {Node} from '@prisma/client';
import WebSocket from 'ws';
import {
	countNodeLikesByNodeId,
	getNodeLikesByNodeIdUserAgentIpAndPort,
	saveNodeData,
	saveNodeLike
} from '../../routes/node/node.service';
import {broadcastToAllExceptSender} from './broadcast';
import logger from '../logger';
import RemoteIpPortAndUserAgent from '../../types/RemoteIpPortAndUserAgent';

const _saveSensorData = async (node: Node, message: object) => {
	if (!('temperature' in message && 'humidity' in message && 'pressure' in message && 'snowDepth' in message && 'pm1' in message && 'pm25' in message && 'pm10' in message)) {
		return;
	}

	const data = {
		temperature: message['temperature'] as number,
		humidity: message['humidity'] as number,
		pressure: message['pressure'] as number,
		snowDepth: message['snowDepth'] as number,
		pm1: message['pm1'] as number,
		pm25: message['pm25'] as number,
		pm10: message['pm10'] as number,
	};

	await saveNodeData(node.id, data);

	return data;
};

const _saveLike = async (node: Node, likeData: {ipAddr: string, remotePort: number, userAgent: string}) => {
	const likes = await getNodeLikesByNodeIdUserAgentIpAndPort({
		nodeId: node.id,
		userAgent: likeData.userAgent,
		ipAddr: likeData.ipAddr,
		remotePort: likeData.remotePort
	});

	// Check if the user has already liked the node
	if (likes != null && likes.length > 0) {
		return null;
	}

	return await saveNodeLike({nodeId: node.id, likeData});
};

/**
 * Handle incoming WebSocket message
 * @param webSocketServer WebSocket server
 * @param sender WebSocket connection
 * @param node Node
 * @param message Message string
 * @param remoteIpPortAndUserAgent Remote IP, port and user agent
 */
const wsHandleMessage = async (
	{webSocketServer, sender, node, message, remoteIpPortAndUserAgent}:
		{webSocketServer: WebSocket.Server, sender: WebSocket, node: Node, message: string, remoteIpPortAndUserAgent: RemoteIpPortAndUserAgent}
) => {
	let parsedMessage: object = {};

	try {
		parsedMessage = JSON.parse(message);
		logger.debug(`Parsed data: ${message}`);
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.warn(`Failed to parse message as JSON: ${error.message}`);
		} else {
			logger.warn(`Failed to parse message as JSON: ${error}`);
		}
	}

	if (!('type' in parsedMessage)) {
		return;
	}

	const type = parsedMessage['type'];

	if (type === 'sensors') {
		const data = await _saveSensorData(node, parsedMessage);
		broadcastToAllExceptSender({
			wss: webSocketServer,
			sender,
			message: JSON.stringify({
				type: 'sensors',
				nodeId: node.id,
				created: new Date(),
				data,
			})
		});

		return;
	}

	if (type === 'likes') {
		const isLikeSaved = await _saveLike(node, remoteIpPortAndUserAgent);
		if (isLikeSaved == null) {
			sender.send(JSON.stringify({
				error: true,
				type: 'likes',
				nodeId: node.id,
				message:'You have already liked'
			}));
			return;
		}

		broadcastToAllExceptSender({
			wss: webSocketServer,
			sender,
			message: JSON.stringify({
				type: 'likes',
				nodeId: node.id,
				likes: await countNodeLikesByNodeId(node.id),
			})
		});

		return;
	}
};

export default wsHandleMessage;
