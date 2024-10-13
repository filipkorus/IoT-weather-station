import http from 'http';
import verifyApiKey from '../utils/verifyApiKey';

const wsAuthenticate = (request: http.IncomingMessage, callback: (error: Error | null, client: unknown/*TODO: implement client type - probably it will be type from Prisma*/ | null) => void) => {
	const apiKey = request.headers['authorization'];

	if (apiKey == null) {
		return callback(new Error('No Authorization header'), null);
	}

	if (!verifyApiKey(apiKey)) {
		return callback(new Error('Invalid API key'), null);
	}

	// TODO: implement functionality of getting client's info from the database based on its API key
	const client = {
		id: 1,
		weatherStationId: 'station1'
	};

	callback(null, client);
};

export default wsAuthenticate;
