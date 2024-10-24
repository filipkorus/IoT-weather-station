import {Node} from '@prisma/client';
import WebSocket from 'ws';
import {
	countNodeLikesByNodeId,
	getNodeLikesByNodeIdUserAgentAndRemoteIp,
	saveNodeData,
	saveNodeLike
} from '../../routes/node/node.service';
import {broadcast, broadcastToAllExceptSender} from './broadcast';
import logger from '../logger';
import WebBrowserClient from '../../types/WebBrowserClient';

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

const _saveLike = async (nodeId: string, client: WebBrowserClient) => {
	const likeData = {
		userAgent: client.userAgent,
		ipAddr: client.ipAddr
	};
	const likes = await getNodeLikesByNodeIdUserAgentAndRemoteIp({
		nodeId,
		...likeData
	});

	// Check if the user has already liked the node
	if (likes != null && likes.length > 0) {
		return null;
	}

	return await saveNodeLike({nodeId, likeData});
};

/**
 * Handle WebSocket message
 * @param webSocketServer WebSocket server
 * @param sender  WebSocket sender
 * @param client Node or WebBrowserClient
 * @param receivedMessage Message
 */
const wsHandleMessage = async (
	{webSocketServer, sender, client, receivedMessage}:
		{webSocketServer: WebSocket.Server, sender: WebSocket, client: Node | WebBrowserClient, receivedMessage: string}
) => {
	let parsedMessage: object = {};

	try {
		parsedMessage = JSON.parse(receivedMessage);
		logger.debug(`Parsed data: ${receivedMessage}`);
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

	if (type === 'sensors' && 'id' in client) {
		const data = await _saveSensorData(client, parsedMessage);
		broadcastToAllExceptSender({
			wss: webSocketServer,
			sender,
			message: JSON.stringify({
				type: 'sensors',
				nodeId: client.id,
				created: new Date(),
				data,
			})
		});

		return;
	}

	if (type === 'likes' && 'nodeId' in parsedMessage && client.name === 'client') {
		const nodeId = (parsedMessage['nodeId'] ?? '') as string;
		const isLikeSaved = await _saveLike(nodeId, client as WebBrowserClient);

		if (isLikeSaved == null) {
			sender.send(JSON.stringify({
				error: true,
				type: 'likes',
				nodeId,
				message:'You have already liked'
			}));
			return;
		}

		broadcast({
			wss: webSocketServer,
			message: JSON.stringify({
				type: 'likes',
				nodeId,
				likes: await countNodeLikesByNodeId(nodeId),
			})
		});

		return;
	}
};

export default wsHandleMessage;
