import { Product } from './Product';

export class Magazine extends Product {
	constructor(
		public id: string,
		public title: string,
		protected _price: number,
		protected _stock: number,
		public issueNumber: number,
		public publisher: string,
		public releaseDate: Date
	) {
		super(id, title, _price, _stock);
	}

	override getDescription(): string {
		return `${this.title} | Issue: ${this.issueNumber} | Publisher: ${this.publisher} | Release Date: ${this.releaseDate} | Price: $${this.price} | Stock: ${this.stock}\n`;
	}

	override applyDiscount(discount: number): void {
		super.applyDiscount(discount + 0.05);
	}

	checkStock(quantity: number): string {
		return this._stock >= quantity ? 'In Stock' : 'Out of Stock';
	}

	rent() {
		console.log('Rent Magazine');
	}
}
