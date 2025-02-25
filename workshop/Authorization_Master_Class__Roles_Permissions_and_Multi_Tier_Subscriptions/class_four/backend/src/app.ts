import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import { authenticate } from './middleware/authenticate';
import { User } from './types';
import { PermissionManager } from './lib/pm/PermissionManager';
import { authorize } from './middleware/authorize';
import { createProduct } from './ProductService';

declare global {
	namespace Express {
		interface Request {
			user?: User;
			pm?: PermissionManager;
		}
	}
}

const app = express();

app.use(cors());
app.use(express.json());

app.get(
	'/',
	authenticate,
	authorize({ permissions: 'product:read' }),
	(req, res) => {
		const pm = req.pm;

		try {
			createProduct(
				{
					name: 'Product 1',
					price: 100,
				},
				{
					userId: req.user?.sub!,
					pm: req.pm!,
				}
			);
		} catch {
			res.status(403).json({
				message: "You don't have permission to create products",
			});
		}

		res.json({
			message: 'Hello World',
			user: req.user,
			hasCreatePermission: pm?.hasPermission('product:manage'),
		});
	}
);

export default app;
