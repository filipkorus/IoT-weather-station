/**
 * Generate a random pairing code
 * @param length {number} Length of the pairing code. Default is 6.
 */
const generatePairingCode = (length: number=6) => {
	const characters = '0123456789';
	let result = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}

	return result;
}

export default generatePairingCode;
