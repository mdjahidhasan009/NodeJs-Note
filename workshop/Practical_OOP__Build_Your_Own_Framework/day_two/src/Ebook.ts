import { Product } from './Product';

export class Ebook extends Product {
	private totalDownloads: number = 0;

	constructor(
		public id: string,
		public title: string,
		public author: string,
		protected _price: number,
		private _downloadLink: string
	) {
		super(id, title, _price, 1);
	}

	getDescription(): string {
		return `${this.title} by ${this.author} | Download Link: ${this._downloadLink} | Total Downloads: ${this.totalDownloads}`;
	}

	set price(price: number) {
		throw new Error('Cannot set price for Ebook');
	}

	download() {
		console.log('Download Ebook');
	}

	checkStock(_quantity: number): string {
		return 'Available for download';
	}
}
