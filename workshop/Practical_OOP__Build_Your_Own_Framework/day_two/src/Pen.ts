import { Product } from './Product';

export class Pen extends Product {
	getDescription(): string {
		return `This is a pen\n`;
	}

	checkStock(quantity: number): string {
		return this._stock >= quantity ? 'In Stock' : 'Out of Stock';
	}
}
