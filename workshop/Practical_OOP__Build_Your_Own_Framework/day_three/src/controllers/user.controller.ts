import { Request, Response, NextFunction } from 'express';
import * as userService from '@/services/user.service';
import { NewUser } from '@/db/schemas/user';

export const createUser = async (
	req: Request<{}, {}, NewUser>,
	res: Response,
	next: NextFunction
) => {
	try {
		const userData: NewUser = req.body;

		if (!userData.email || !userData.password || !userData.name) {
			return next(new Error('Missing required fields'));
		}

		const existingUser = await userService.findUserByEmail(userData.email);
		if (existingUser) {
			return next(new Error('Email already exists'));
		}

		const user = await userService.createRegularUser(userData);
		return res.status(201).json(user[0]);
	} catch (error) {
		console.error('Error creating user:', error);
		return next(new Error('Internal server error'));
	}
};

export const getUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		if (!id) {
			return next(new Error('User ID is required'));
		}

		const user = await userService.findUserById(id);
		if (!user) {
			return next(new Error('User not found'));
		}

		return res.status(200).json(user);
	} catch (error) {
		console.error('Error fetching user:', error);
		return next(new Error('Internal server error'));
	}
};

export const updateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		if (!id) {
			return next(new Error('User ID is required'));
		}

		const user = await userService.findUserById(id);
		if (!user) {
			return next(new Error('User not found'));
		}

		let updatedUser;
		if (updates.name) {
			updatedUser = await userService.updateUserName(id, updates.name);
		}
		if (updates.email) {
			const existingUser = await userService.findUserByEmail(updates.email);
			if (existingUser && existingUser.id !== id) {
				return next(new Error('Email already exists'));
			}
			updatedUser = await userService.updateUserEmail(id, updates.email);
		}
		if (updates.password) {
			updatedUser = await userService.updateUserPassword(id, updates.password);
		}
		if (updates.status) {
			updatedUser = await userService.updateUserStatus(id, updates.status);
		}

		return res.status(200).json(updatedUser?.[0]);
	} catch (error) {
		console.error('Error updating user:', error);
		return next(new Error('Internal server error'));
	}
};

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { permanent } = req.query;

		if (!id) {
			return next(new Error('User ID is required'));
		}

		const user = await userService.findUserById(id);
		if (!user) {
			return next(new Error('User not found'));
		}

		let deletedUser;
		if (permanent === 'true') {
			deletedUser = await userService.permanentlyDeleteUser(id);
		} else {
			deletedUser = await userService.softDeleteUser(id);
		}

		return res.status(200).json(deletedUser[0]);
	} catch (error) {
		console.error('Error deleting user:', error);
		return next(new Error('Internal server error'));
	}
};

export const searchUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { query = '', type = 'name', page = '1', limit = '10' } = req.query;

		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);

		let users;
		if (type === 'email') {
			users = await userService.searchUsersByEmail(
				query as string,
				pageNum,
				limitNum
			);
		} else {
			users = await userService.searchUsersByName(
				query as string,
				pageNum,
				limitNum
			);
		}

		return res.status(200).json(users);
	} catch (error) {
		console.error('Error searching users:', error);
		return next(new Error('Internal server error'));
	}
};
