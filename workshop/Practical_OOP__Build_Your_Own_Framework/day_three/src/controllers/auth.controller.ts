import { Request, Response, NextFunction } from 'express';
import * as userService from '@/services/user.service';
import bcrypt from 'bcryptjs';
import { NewUser } from '@/db/schemas/user';
import jwt from 'jsonwebtoken';

export const register = async (
	req: Request<{}, {}, NewUser>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password, name } = req.body;

		// Validate required fields
		if (!email || !password || !name) {
			return next(new Error('Missing required fields'));
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return next(new Error('Invalid email format'));
		}

		// Check if user already exists
		const existingUser = await userService.findUserByEmail(email);
		if (existingUser) {
			return next(new Error('Email already registered'));
		}

		// Create new user
		const user = await userService.createRegularUser({ email, password, name });

		// Remove password from response
		const { password: _, ...userWithoutPassword } = user[0];
		return res.status(201).json(userWithoutPassword);
	} catch (error) {
		console.error('Registration error:', error);
		return next(new Error('Internal server error'));
	}
};

interface LoginBody {
	email: string;
	password: string;
}

export const login = async (
	req: Request<{}, {}, LoginBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body;

		// Validate required fields
		if (!email || !password) {
			return next(new Error('Email and password are required'));
		}

		// Find user by email
		const user = await userService.findUserByEmail(email);
		if (!user) {
			return next(new Error('Invalid credentials'));
		}

		// Check if user is active
		if (user.status === 'inactive') {
			return next(new Error('Account is inactive'));
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return next(new Error('Invalid credentials'));
		}

		// Create JWT token
		const token = jwt.sign(
			{ userId: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET || 'your-secret-key',
			{ expiresIn: '24h' }
		);

		// Remove password from response
		const { password: _, ...userWithoutPassword } = user;
		return res.status(200).json({
			user: userWithoutPassword,
			token,
		});
	} catch (error) {
		console.error('Login error:', error);
		return next(new Error('Internal server error'));
	}
};

interface ChangePasswordParams {
	id: string;
}

interface ChangePasswordBody {
	currentPassword: string;
	newPassword: string;
}

export const changePassword = async (
	req: Request<ChangePasswordParams, {}, ChangePasswordBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return next(new Error('Current and new passwords are required'));
		}

		// Find user
		const user = await userService.findUserById(id);
		if (!user) {
			return next(new Error('User not found'));
		}

		// Verify current password
		const isValidPassword = await bcrypt.compare(
			currentPassword,
			user.password
		);
		if (!isValidPassword) {
			return next(new Error('Current password is incorrect'));
		}

		// Update password
		const updatedUser = await userService.updateUserPassword(id, newPassword);

		// Remove password from response
		const { password: _, ...userWithoutPassword } = updatedUser[0];
		return res.status(200).json(userWithoutPassword);
	} catch (error) {
		console.error('Change password error:', error);
		return next(new Error('Internal server error'));
	}
};
