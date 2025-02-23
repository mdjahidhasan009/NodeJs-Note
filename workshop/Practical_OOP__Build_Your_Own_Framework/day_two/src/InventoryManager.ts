import { Book } from './Book';
import { Magazine } from './Magazine';
import { Product } from './Product';
import { Ebook } from './Ebook';

export class InventoryManager {
	private products: Map<string, Product> = new Map();
	private salesHistory: Array<{
		productId: string;
		date: Date;
		quantity: number;
		revenue: number;
	}> = [];

	addProduct(product: Product): void {
		this.products.set(product.id, product);
	}

	removeProduct(productId: string): boolean {
		return this.products.delete(productId);
	}

	getProduct(productId: string): Product | undefined {
		return this.products.get(productId);
	}

	getAllProducts(): Product[] {
		return Array.from(this.products.values());
	}

	recordSale(productId: string, quantity: number): boolean {
		const product = this.products.get(productId);
		if (product && product.removeStock(quantity)) {
			const revenue = product.price * quantity;
			this.salesHistory.push({
				date: new Date(),
				productId,
				quantity,
				revenue,
			});
			return true;
		}
		return false;
	}

	getTotalInventoryValue(): number {
		return Array.from(this.products.values()).reduce((total, product) => {
			const value = product.price * product.stock;
			return isFinite(value) ? total + value : total;
		}, 0);
	}

	getBooks(): Book[] {
		return Array.from(this.products.values()).filter(
			(product) => product instanceof Book
		) as Book[];
	}

	getMagazines(): Magazine[] {
		return Array.from(this.products.values()).filter(
			(product) => product instanceof Magazine
		) as Magazine[];
	}

	getEBooks(): Ebook[] {
		return Array.from(this.products.values()).filter(
			(product) => product instanceof Ebook
		) as Ebook[];
	}

	generateInventoryReport(): string {
		let report = '=== Inventory Report ===\n';
		report += `Total Products: ${this.products.size}\n`;

		const totalValue = this.getTotalInventoryValue();
		report += `Total Value: ${
			isFinite(totalValue) ? '$' + totalValue.toFixed(2) : 'N/A'
		}\n\n`;

		this.products.forEach((product) => {
			report += `${product.getDescription()}\n`;
			report += `Stock Status: ${product.checkStock(1)}\n\n`;
		});

		return report;
	}

	generateSalesReport(startDate?: Date, endDate?: Date): string {
		let filteredSales = this.salesHistory;
		if (startDate && endDate) {
			filteredSales = this.salesHistory.filter(
				(sale) => sale.date >= startDate && sale.date <= endDate
			);
		}

		const totalRevenue = filteredSales.reduce(
			(sum, sale) => sum + sale.revenue,
			0
		);
		const totalItems = filteredSales.reduce(
			(sum, sale) => sum + sale.quantity,
			0
		);

		let report = '=== Sales Report ===\n';
		report += `Period: ${startDate?.toLocaleDateString() || 'All time'} to ${
			endDate?.toLocaleDateString() || 'present'
		}\n`;
		report += `Total Revenue: $${totalRevenue.toFixed(2)}\n`;
		report += `Items Sold: ${totalItems}\n`;

		return report;
	}
}
