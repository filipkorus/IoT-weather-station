import http from 'http';
import wsVerifyApiKey from './wsVerifyApiKey';
import {Node} from '@prisma/client';
import {setNodeIsOnline} from '../../routes/node/node.service';

// This function is used to authenticate WebSocket connections.
const wsAuthenticate = async (request: http.IncomingMessage, callback: (error: Error | null, client: Node | null) => void) => {
	const apiKey = request.headers['authorization'];
	if (apiKey == null) {
		return callback(new Error('No Authorization header'), null);
	}

	const node = await wsVerifyApiKey(apiKey);
	if (!node) {
		return callback(new Error('Invalid API key'), null);
	}

	await setNodeIsOnline(node.id, true);

	callback(null, node );
};

export default wsAuthenticate;
