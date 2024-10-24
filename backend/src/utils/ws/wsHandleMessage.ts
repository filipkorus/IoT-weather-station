import {Gateway, Node} from '@prisma/client';
import WebSocket from 'ws';
import {
	countGatewayLikesByGatewayId,
	getGatewayLikesByGatewayIdUserAgentAndRemoteIp,
	saveGatewayLike
} from '../../routes/gateway/gateway.service';
import {broadcast, broadcastToAllExceptSender} from './broadcast';
import logger from '../logger';
import WebBrowserClient from '../../types/WebBrowserClient';
import {saveNodeData} from '../../routes/gateway/node.servcie';

const _saveSensorData = async ({nodeId, message}: {nodeId: string, message: object}) => {
	if (!('temperature' in message && 'humidity' in message && 'pressure' in message && 'snowDepth' in message && 'pm1' in message && 'pm25' in message && 'pm10' in message)) {
		return null;
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

	await saveNodeData({
		nodeId,
		data
	});

	return data;
};

const _saveLike = async ({gatewayId, client}: {gatewayId: string, client: WebBrowserClient}) => {
	const likeData = {
		userAgent: client.userAgent,
		ipAddr: client.ipAddr
	};
	const likes = await getGatewayLikesByGatewayIdUserAgentAndRemoteIp({
		gatewayId: gatewayId,
		...likeData
	});

	// Check if the user has already liked the node
	if (likes != null && likes.length > 0) {
		return null;
	}

	return await saveGatewayLike({gatewayId, likeData});
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
		{webSocketServer: WebSocket.Server, sender: WebSocket, client: Gateway | WebBrowserClient, receivedMessage: string}
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

	if (type === 'sensors' && 'id' in client && 'nodeId' in parsedMessage) {
		const nodeId = parsedMessage['nodeId'] as string;
		const gatewayId = client.id;

		const sensorData = await _saveSensorData({
			nodeId,
			message: parsedMessage
		});
		broadcastToAllExceptSender({
			wss: webSocketServer,
			sender,
			message: JSON.stringify({
				type: 'sensors-to-client',
				gatewayId,
				nodeId,
				created: new Date(),
				data: sensorData
			})
		});

		return;
	}

	if (type === 'likes' && 'gatewayId' in parsedMessage && client.name === 'client') {
		const gatewayId = (parsedMessage['gatewayId'] ?? '') as string;
		const isLikeSaved = await _saveLike({
			gatewayId,
			client: client as WebBrowserClient
		});

		if (isLikeSaved == null) {
			sender.send(JSON.stringify({
				error: true,
				type: 'likes-response',
				gatewayId,
				message: 'You have already liked'
			}));
			return;
		}

		broadcast({
			wss: webSocketServer,
			message: JSON.stringify({
				type: 'likes',
				gatewayId,
				likes: await countGatewayLikesByGatewayId(gatewayId),
			})
		});

		return;
	}
};

export default wsHandleMessage;
