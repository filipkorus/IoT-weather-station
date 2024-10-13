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
import wsAuthenticate from './middlewares/wsAuthenticate';

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
	logger.info('Client connected via WebSocket');

	ws.on('message', (message: WebSocket.RawData) => {
		logger.debug(`Received message: ${message}`);

		const messageString = message.toString();

		try {
			const data = JSON.parse(messageString);

			// TODO: Implement handling of the parsed data here
			logger.debug(`Parsed data: ${messageString}`);
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.warn(`Failed to parse message as JSON: ${error.message}`);
			} else {
				logger.warn(`Failed to parse message as JSON: ${error}`);
			}
		}

		// Respond to the client
		ws.send('ack');
	});

	ws.on('error', logger.error);
	ws.on('close', () => logger.debug('Client disconnected'));
});

httpServer.on('upgrade', (request, socket, head) => {
	logger.debug('Upgrading to WebSocket');
	socket.on('error', logger.error);

	wsAuthenticate(request, (err, client) => {
		if (err || !client) {
			socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
			socket.destroy();

			logger.warn('WebSocket authentication failed');
			return;
		}

		socket.removeListener('error', logger.error);

		wss.handleUpgrade(request, socket, head, ws => {
			wss.emit('connection', ws, request, client);
			logger.debug('WebSocket connection established');
		});
	});
});

export default httpServer;
