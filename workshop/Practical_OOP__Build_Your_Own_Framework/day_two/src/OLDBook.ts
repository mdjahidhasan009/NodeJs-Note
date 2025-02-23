export class Book {
	constructor(
		public id: string,
		public title: string,
		public author: string,
		private _price: number,
		private _stock: number
	) {}

	get price(): number {
		return this._price;
	}

	set price(newPrice: number) {
		if (newPrice >= 0) {
			this._price = newPrice;
		}
	}

	get stock(): number {
		return this._stock;
	}

	addStock(quantity: number) {
		if (quantity > 0) {
			this._stock += quantity;
		}
	}

	removeStock(quantity: number) {
		if (quantity > 0 && quantity <= this._stock) {
			this._stock -= quantity;
		}
	}

	checkStock(quantity: number): boolean {
		return this._stock >= quantity;
	}
}

export class Magazine {
	constructor(
		public id: string,
		public title: string,
		public publisher: string,
		private _price: number,
		private _stock: number
	) {}

	get price(): number {
		return this._price;
	}

	set price(newPrice: number) {
		if (newPrice >= 0) {
			this._price = newPrice;
		}
	}

	get stock(): number {
		return this._stock;
	}

	addStock(quantity: number) {
		if (quantity > 0) {
			this._stock += quantity;
		}
	}

	removeStock(quantity: number) {
		if (quantity > 0 && quantity <= this._stock) {
			this._stock -= quantity;
		}
	}

	checkStock(quantity: number): boolean {
		return this._stock >= quantity;
	}
}

export class Ebook {
	private _downloadCount: number = 0;

	constructor(
		public id: string,
		public title: string,
		public author: string,
		private _price: number,
		private _downloadLink: string
	) {}

	get price(): number {
		return this._price;
	}

	set price(newPrice: number) {
		if (newPrice >= 0) {
			this._price = newPrice;
		}
	}

	download() {
		this._downloadCount++;
		return this._downloadLink;
	}

	get totalDownloads(): number {
		return this._downloadCount;
	}
}

const inventory = [
	new Book('1', 'The Great Gatsby', 'F. Scott Fitzgerald', 10, 5),
	new Magazine('2', 'National Geographic', 'National Geographic', 10, 5),
	new Ebook(
		'3',
		'The Great Gatsby',
		'F. Scott Fitzgerald',
		10,
		'https://www.google.com'
	),
];
