import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/main.router';
import requestLogger from './middlewares/requestLogger';
import {NOT_FOUND} from './utils/httpCodeResponses/messages';
import config from '../config';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import logger from './utils/logger';
import authenticate from './middlewares/authenticate';
import authenticateGateway from './middlewares/authenticateGateway';
import wsAuthenticate from './utils/ws/wsAuthenticate';
import {onSocketPostError, onSocketPreError} from './utils/ws/wsOnError';
import {setGatewayIsOnline} from './routes/gateway/gateway.service';
import wsHandleMessage from './utils/ws/wsHandleMessage';
import wsRemoteIpAndUserAgent from './utils/ws/wsRemoteIpAndUserAgent';
import {Gateway, Node} from '@prisma/client';
import WebBrowserClient from './types/WebBrowserClient';

const app = express();
const httpServer = http.createServer(app);

/* basic express config */
app.use(cors({
	origin: config.ALLOWED_ORIGINS.map(origin => new RegExp(`^${origin}`)),
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());

/* custom middlewares */
app.use(authenticate);
app.use(authenticateGateway);
app.use(requestLogger);

/* main router */
app.use('/', router);

/* 404 Not Found handler */
app.use('*', (req, res) => NOT_FOUND(res));

/* WebSocket server */
const wss = new WebSocketServer({ noServer: true });

const isClientGateway = (client: Gateway | WebBrowserClient): client is Gateway => 'id' in client;
const isClientWebBrowser = (client: Gateway | WebBrowserClient): client is WebBrowserClient => 'userAgent' in client;

wss.on('connection', async (ws: WebSocket, request: http.IncomingMessage, client: Gateway | WebBrowserClient) => {
	let isClientAlive = true;
	if (isClientWebBrowser(client)) { // check if client is a WebBrowserClient and overwrite its properties
		const {ipAddr, userAgent} = wsRemoteIpAndUserAgent(ws, request);
		client.ipAddr = ipAddr;
		client.userAgent = userAgent;
	}

	if (isClientGateway(client)) { // check if client is a Gateway
		ws.on('pong', async () => { isClientAlive = true; });
		logger.info(`Gateway (id=${client.id}) connected`);
	}

	// Ping clients to check connectivity
	const interval = setInterval(async () => {
		// Only ping gateways
		if (!isClientGateway(client)) { return; }

		if (!isClientAlive) {
			logger.info(`Gateway (id=${client.id}) is unresponsive. Terminating connection...`);
			ws.terminate(); // Forcefully close connection if no pong is received
			return;
		}

		isClientAlive = false;
		ws.ping(); // Send ping message to client (Gateway)
	}, config.PING_INTERVAL_MS);

	ws.on('message', (message: WebSocket.RawData, isBinary: boolean) => {
		logger.verbose(`Received message: ${message}`);

		wsHandleMessage({
			webSocketServer: wss,
			sender: ws,
			client,
			receivedMessage: message.toString()
		});
	});

	ws.on('error', onSocketPostError);
	ws.on('close', () => {
		clearInterval(interval);

		if (isClientGateway(client)) {
			logger.debug(`Gateway (id=${client.id}) disconnected`);
			setGatewayIsOnline(client.id, false);
		}
	});
});

httpServer.on('upgrade', async (request, socket, head) => {
	logger.debug('Upgrading to WebSocket');
	socket.on('error', onSocketPreError);

	await wsAuthenticate(request, (err, client) => {
		if (err || !client) {
			socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
			socket.destroy();

			logger.debug('WebSocket authentication failed');
			return;
		}

		wss.handleUpgrade(request, socket, head, ws => {
			socket.removeListener('error', onSocketPreError);

			wss.emit('connection', ws, request, client);
			logger.debug('WebSocket connection established');
		});
	});
});

export default httpServer;
