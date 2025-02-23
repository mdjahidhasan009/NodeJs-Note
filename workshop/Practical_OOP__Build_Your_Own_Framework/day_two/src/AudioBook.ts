import { Product } from './Product';

export class AudioBook extends Product {
	override getDescription(): string {
		return `This is an audio book, you can listen to it\n`;
	}

	checkStock(quantity: number): string {
		return this._stock >= quantity ? 'In Stock' : 'Out of Stock';
	}
}
