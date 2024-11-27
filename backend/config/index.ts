import 'dotenv/config';
import checkObjectValuesNotNull from '../src/utils/checkObjectValuesNotNull';

const config = {
	PRODUCTION: process.env.PRODUCTION === 'true' ?? true,
	PORT: process.env.PORT ?? 5001,
	ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(';') ?? [],
	LOGGER: {
		LEVEL: process.env.LOG_LEVEL ?? 'debug',
		SAVE_TO_FILE: false,
		FILE: 'app.log'
	},
	DATABASE_URL: process.env.DATABASE_URL,
	PING_INTERVAL_MS: parseInt(process.env.PING_INTERVAL_MS ?? '5000'),
	VENDOR_API_KEY: process.env.VENDOR_API_KEY,
	JWT: {
		ACCESS_TOKEN: {
			SECRET: 'q8j23_dnej823y_h2s8427vf131k_94_k2d4',
			EXPIRES_IN: '10m'
		},
		REFRESH_TOKEN: {
			SECRET: 'fadf31b52n3tsdxf83_2jsd2m2g9qQey3g',
			EXPIRES_IN_DAYS: 7
		},
	},
	TEST: {
		USER_ID: 1,
		ACCESS_TOKEN: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
	}
} as const;

const checkConfigFields = (): Promise<string> => {
	const nullConfigFieldPath = checkObjectValuesNotNull(config);

	if (typeof nullConfigFieldPath === 'string') {
		return Promise.reject(`Config field (config.${nullConfigFieldPath}) is null or undefined`);
	}

	return Promise.resolve('Checking config values: OK');
}

export {checkConfigFields};

export default config;
