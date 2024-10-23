import {PrismaClient, User} from "@prisma/client";
import logger from '../../utils/logger';

const prisma = new PrismaClient();

/**
 * Checks if username already exists.
 *
 * @returns {Promise<boolean>} Promise<Boolean> which indicates if username is already used.
 * @param username {string} Username to be checked.
 */
export const usernameExists = async (username: string): Promise<boolean> => {
	try {
		return await prisma.user.count({where: {username}}) > 0;
	} catch (error) {
		logger.error(error);
		return true;
	} finally {
		await prisma.$disconnect();
	}
}

/**
 * Save user data in the database.
 *
 * @returns {Promise<User|null>} User object from database or null if error.
 */
export const createUser = async ({username, passwordHash}: {
	username: string,
	passwordHash: string
}): Promise<User | null> => {
	let user = null;
	try {
		user = await prisma.user.create({
			data: {
				username,
				passwordHash
			}
		});
		if (user == null) return null;
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}

	return user;
};

/**
 * Returns user object with given user ID.
 *
 * @returns {Promise<User|null>|null} User object or null if error.
 * @param userId {number} User's ID.
 */
export const getUserById = (userId: number): Promise<User | null> | null => {
	try {
		return prisma.user.findFirst({where: {id: userId}});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		prisma.$disconnect();
	}
};

/**
 * Returns user object by given username.
 *
 * @returns {Promise<User|null>} User object or null if error.
 * @param username {string} Username of user to be found.
 */
export const getUserByUsername = async (username: string): Promise<User | null> => {
	try {
		return await prisma.user.findFirst({
			where: {username}
		});
	} catch (error) {
		logger.error(error);
		return null;
	} finally {
		await prisma.$disconnect();
	}
};
