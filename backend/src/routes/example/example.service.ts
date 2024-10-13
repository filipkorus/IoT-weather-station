import {PrismaClient, User} from '@prisma/client';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

/**
 * Example function to demonstrate how to use database stuff.
 *
 * @returns {Promise<string>} Promise<string> resolving to 'example' or 'example error' in case of failure.
 */
export const getExample = async (): Promise<string> => {
	try {
		return Promise.resolve('example');
	} catch (error) {
		logger.error(error);
		return Promise.reject('example error');
	} finally {
		await prisma.$disconnect();
	}
}
