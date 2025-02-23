export abstract class Product {
	protected _discount: number = 0;
	public readonly id: string;
	public readonly title: string;
	protected _price: number;
	protected _stock: number;

	constructor(id: string, title: string, _price: number, _stock: number) {
		this.id = id;
		this.title = title;
		this._price = _price;
		this._stock = _stock;
	}

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
			return true;
		}
		return false;
	}

	applyDiscount(discount: number) {
		if (discount >= 0 && discount <= 1) {
			this._discount = discount;
		}
	}

	abstract getDescription(): string;
	abstract checkStock(quantity: number): string;
}
