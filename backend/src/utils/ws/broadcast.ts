import WebSocket, { WebSocketServer } from 'ws';

type Message = WebSocket.RawData | string;

/**
 * Converts a string message to WebSocket.RawData (Buffer) if necessary.
 * @param {Message} message - The message to be sent, either as a string or RawData.
 * @returns {WebSocket.RawData} The message as RawData (Buffer or WebSocket.RawData).
 */
const toRawData = (message: Message): WebSocket.RawData => {
	return typeof message === 'string' ? Buffer.from(message) : message;
};

interface BroadcastOptions {
	wss: WebSocketServer;
	message: Message;
	isBinary?: boolean;
}

/**
 * Broadcasts a message to all connected clients.
 * @param {WebSocketServer} wss - The WebSocket server instance.
 * @param {Message} message - The message to be broadcasted.
 * @param {boolean} [isBinary=false] - Whether the message should be sent as binary data.
 */
const broadcast = ({ wss, message, isBinary = false }: BroadcastOptions): void => {
	const rawData = toRawData(message);
	wss.clients.forEach((client: WebSocket) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(rawData, { binary: isBinary });
		}
	});
};

interface BroadcastToAllExceptSenderOptions extends BroadcastOptions {
	sender: WebSocket;
}

/**
 * Broadcasts a message to all connected clients except the sender.
 * @param {WebSocketServer} wss - The WebSocket server instance.
 * @param {WebSocket} sender - The client that should not receive the message.
 * @param {Message} message - The message to be broadcasted.
 * @param {boolean} [isBinary=false] - Whether the message should be sent as binary data.
 */
const broadcastToAllExceptSender = ({ wss, sender, message, isBinary = false }: BroadcastToAllExceptSenderOptions): void => {
	const rawData = toRawData(message);
	wss.clients.forEach((client: WebSocket) => {
		if (client !== sender && client.readyState === WebSocket.OPEN) {
			client.send(rawData, { binary: isBinary });
		}
	});
};

export { broadcast, broadcastToAllExceptSender };
