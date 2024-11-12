import http from 'http';
import wsVerifyApiKey from './wsVerifyApiKey';
import {Gateway} from '@prisma/client';
import {setGatewayIsOnline} from '../../routes/gateway/gateway.service';
import WebBrowserClient from '../../types/WebBrowserClient';

// This function is used to authenticate WebSocket connections.
const wsAuthenticate = async (request: http.IncomingMessage, callback: (error: Error | null, client: Gateway | WebBrowserClient | null) => void) => {
	const apiKey = request.headers['authorization'];
	if (apiKey == null) {
		return callback(null, {name: 'client', ipAddr: 'client', userAgent: 'client'});
	}

	const node = await wsVerifyApiKey(apiKey);
	if (!node) {
		return callback(new Error('Invalid API key'), null);
	}

	await setGatewayIsOnline(node.id, true);

	callback(null, node );
};

export default wsAuthenticate;
