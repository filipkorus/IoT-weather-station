import {
	deleteExpiredRefreshTokens, deleteRefreshToken,
	generateAccessToken,
	generateRefreshToken, hashPassword, isPassCorrect, isRefreshTokenValid,
	verifyRefreshToken
} from './auth.service';
import {
	ACCOUNT_CREATED,
	CONFLICT, SERVER_ERROR,
	MISSING_BODY_FIELDS,
	SUCCESS, UNAUTHORIZED
} from '../../utils/httpCodeResponses/messages';
import {createUser, usernameExists, getUserByUsername} from '../user/user.service';
import config from '../../../config';
import {Request, Response} from 'express';
import {z} from 'zod';
import validateObject from '../../utils/validateObject';

export const RegisterHandler = async (req: Request, res: Response) => {
	await deleteExpiredRefreshTokens();

	const RequestSchema = z.object({
		username: z.string({required_error: 'username is required'}).trim().toLowerCase().max(255),
		password: z.string({required_error: 'password is required'})
			.min(6, 'Minimum password length is 6')
			.max(255, 'Maximum password length is 255'),
	});

	const validatedRequest = validateObject(RequestSchema, req.body);

	if (validatedRequest.data == null) {
		return MISSING_BODY_FIELDS(res, validatedRequest.errors);
	}

	if (await usernameExists(validatedRequest.data.username)) {
		return CONFLICT(res, 'Account with given username already exist');
	}

	if (!(await createUser({
		username: validatedRequest.data.username,
		passwordHash: await hashPassword(validatedRequest.data.password),
	}))) {
		return SERVER_ERROR(res, 'Error: try again later');
	}

	return ACCOUNT_CREATED(res);
};

export const LoginHandler = async (req: Request, res: Response) => {
	await deleteExpiredRefreshTokens();

	const RequestSchema = z.object({
		username: z.string({required_error: 'username is required'}).trim().toLowerCase().max(255),
		password: z.string({required_error: 'password is required'}).max(255),
	});

	const validatedRequest = validateObject(RequestSchema, req.body);

	if (validatedRequest.data == null) {
		return MISSING_BODY_FIELDS(res, validatedRequest.errors);
	}

	const user = await getUserByUsername(validatedRequest.data.username);

	if (user == null) {
		return UNAUTHORIZED(res);
	}

	if (!(await isPassCorrect(validatedRequest.data.password, user.passwordHash))) {
		return UNAUTHORIZED(res);
	}

	const refreshToken = await generateRefreshToken(user.id);
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + config.JWT.REFRESH_TOKEN.EXPIRES_IN_DAYS); // add X days to current time

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		maxAge: expiresAt.getTime(),
		sameSite: 'strict'
	});

	const accessToken = generateAccessToken(user.id);

	const {passwordHash, ...rest} = user; // password hash cannot be sent to browser
	const data = {
		token: accessToken,
		user: rest
	};

	return SUCCESS(res, 'Logged successfully', data);
};

export const RefreshTokenHandler = async (req: Request, res: Response) => {
	const refreshToken = req.cookies['refreshToken'];
	if (refreshToken == null) {
		return UNAUTHORIZED(res);
	}

	const payload = verifyRefreshToken(refreshToken);
	if (
		payload == null ||
		!(typeof payload === 'object' && 'id' in payload && typeof payload.id === 'number')
	) {
		return UNAUTHORIZED(res);
	}

	if (!(await isRefreshTokenValid(refreshToken, payload.id))) {
		return UNAUTHORIZED(res);
	}

	const newAccessToken = generateAccessToken(payload.id);

	return SUCCESS(res, 'Access token has been refreshed', {token: newAccessToken});
};

export const LogoutHandler = async (req: Request, res: Response) => {
	const refreshToken = req.cookies['refreshToken'];

	await deleteRefreshToken(refreshToken); // delete refresh token from DB
	res.cookie('refreshToken', '', {maxAge: 0}); // delete http-only cookie refresh token

	return SUCCESS(res, 'Logged out successfully');
};
