import {getGatewayByApiKey} from '../../routes/gateway/gateway.service';

/**
 * Verifies API key of the WebSocket client.
 *
 * @param apiKey API key to be verified.
 * @returns Node Node object if API key is valid, otherwise false.
 */
const wsVerifyApiKey = async (apiKey: string) => {
	const node = await getGatewayByApiKey(apiKey);

	if (node == null) {
		return false;
	}

	return node;
};

export default wsVerifyApiKey;
