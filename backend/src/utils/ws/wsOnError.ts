import logger from '../logger';

const onSocketPreError = (error: Error) => {
	logger.error(error);
}

const onSocketPostError = (error: Error) => {
	logger.error(error);
}

export {onSocketPreError, onSocketPostError};
