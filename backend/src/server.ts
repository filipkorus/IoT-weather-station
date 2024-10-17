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
import authenticate from './utils/ws/authenticate';
import {broadcast} from './utils/ws/broadcast';

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
app.use(requestLogger);

/* main router */
app.use('/', router);

/* 404 Not Found handler */
app.use('*', (req, res) => NOT_FOUND(res));

/* WebSocket server */
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
	ws.on('message', (message: WebSocket.RawData, isBinary: boolean) => {
		logger.verbose(`Received message: ${message}`);

		const messageString = message.toString();

		broadcast({wss, message: messageString});

		try {
			const data = JSON.parse(messageString);
			logger.debug(`Parsed data: ${messageString}`);

			// TODO: Implement handling of the parsed data here
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.warn(`Failed to parse message as JSON: ${error.message}`);
			} else {
				logger.warn(`Failed to parse message as JSON: ${error}`);
			}
		}
	});

	ws.on('error', logger.error);
	ws.on('close', () => logger.debug('Client disconnected'));
});

httpServer.on('upgrade', (request, socket, head) => {
	logger.debug('Upgrading to WebSocket');
	socket.on('error', logger.error);

	authenticate(request, (err, client) => {
		if (err || !client) {
			socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
			socket.destroy();

			logger.debug('WebSocket authentication failed');
			return;
		}

		wss.handleUpgrade(request, socket, head, ws => {
			socket.removeListener('error', logger.error);

			wss.emit('connection', ws, request, client);
			logger.debug('WebSocket connection established');
		});
	});
});

export default httpServer;
