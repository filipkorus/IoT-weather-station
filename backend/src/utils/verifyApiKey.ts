/**
 * Verifies the API key.
 * @param apiKey The API key to verify.
 */
const verifyApiKey = (apiKey: string) => {
	// TODO: Implement API key verification
	if (apiKey === 'badkey') {
		return false;
	}

	return true;
};

export default verifyApiKey
