import { NextFunction, Request, Response } from 'express';

type AuthorizeOptions = {
	permissions?: string | string[];
	role?: string;
};

export const authorize = ({ permissions, role }: AuthorizeOptions) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.pm) {
			res.status(401).json({
				message: 'Unauthorized',
			});
			return;
		}

		const checkRole = () => {
			if (!role) return true;
			return req.pm?.hasRole(role) ?? false;
		};

		const checkPermissions = () => {
			if (!permissions) return true;
			if (Array.isArray(permissions)) {
				return req.pm?.hasPermissions(permissions) ?? false;
			}
			return req.pm?.hasPermission(permissions) ?? false;
		};

		const hasAccess = checkRole() && checkPermissions();

		if (hasAccess) {
			next();
			return;
		}

		res.status(403).json({
			message: 'Forbidden',
		});
	};
};
