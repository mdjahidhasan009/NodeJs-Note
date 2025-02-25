import { Request, Response, NextFunction } from 'express';
import { jwtValidationResponse, validateToken } from '@kinde/jwt-validator';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';
import { PermissionManager } from '../lib/pm/PermissionManager';

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		res.status(401).json({
			message: 'Unauthorized',
		});
		return;
	}

	const validationResult: jwtValidationResponse = await validateToken({
		token,
		domain: process.env.KINDE_DOMAIN,
	});

	if (validationResult.valid) {
		const user = jwtDecode<User>(token);

		const pm = new PermissionManager({
			roles: user.roles.map((role) => role.key),
			permissions: user.permissions,
		});

		req.user = user;
		req.pm = pm;

		next();
		return;
	}

	res.status(401).json({
		message: 'Unauthorized',
	});
};
