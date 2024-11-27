import { randomBytes } from 'crypto';

const generateApiKey = (length: number = 128) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;

	const randomValues = randomBytes(length);
	let result = '';

	for (let i = 0; i < length; i++) {
		// Use the random byte value to index into the characters string
		result += characters.charAt(randomValues[i] % charactersLength);
	}

	return result;
};

export default generateApiKey;
