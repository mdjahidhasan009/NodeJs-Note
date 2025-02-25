import { PermissionManager } from './lib/pm/PermissionManager';

type Product = {
	name: string;
	price: number;
};

type ServiceOptions = {
	userId: string;
	pm: PermissionManager;
};

export const createProduct = (product: Product, options?: ServiceOptions) => {
	const pm = options?.pm;

	if (pm?.hasPermission('product:create')) {
		console.log('Creating product:', product);
	} else {
		throw new Error('Unauthorized');
	}
};
