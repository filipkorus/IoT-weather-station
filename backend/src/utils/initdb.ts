import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Initializes the database by checking the Prisma connection.
 * Ensures that the server can connect to the database successfully.
 *
 * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
 */
const initDB = async (): Promise<string> => {
	try {
		await prisma.$connect();
		return Promise.resolve('Database initialization: OK');
	} catch (error) {
		return Promise.reject('Database initialization: FAILED');
	} finally {
		await prisma.$disconnect();
	}
};

export default initDB;
