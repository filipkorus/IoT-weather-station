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
import wsAuthenticate from './utils/ws/wsAuthenticate';
import {onSocketPostError, onSocketPreError} from './utils/ws/wsOnError';
import {setNodeIsOnline} from './routes/node/node.service';
import wsHandleMessage from './utils/ws/wsHandleMessage';
import wsRemoteIpAndUserAgent from './utils/ws/wsRemoteIpAndUserAgent';
import {Node} from '@prisma/client';
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
app.use(requestLogger);

/* main router */
app.use('/', router);

/* 404 Not Found handler */
app.use('*', (req, res) => NOT_FOUND(res));

/* WebSocket server */
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (ws: WebSocket, request: http.IncomingMessage, client: Node | WebBrowserClient) => {
	const webBrowserClientInfo = wsRemoteIpAndUserAgent(ws, request);
	if ('userAgent' in client) { // check if client is a WebBrowserClient and overwrite its properties
		client.ipAddr = webBrowserClientInfo.ipAddr;
		client.userAgent = webBrowserClientInfo.userAgent;
	}

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
		if ('id' in client) {
			logger.debug(`Node (id=${client.id}) disconnected`);
			setNodeIsOnline(client.id, false);
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
