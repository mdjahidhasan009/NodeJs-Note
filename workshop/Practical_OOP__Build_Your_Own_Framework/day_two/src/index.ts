// import { InventoryManager } from './InventoryManager';
// import { Book } from './Book';
// import { Magazine } from './Magazine';
// import { Ebook } from './Ebook';
// import { AudioBook } from './AudioBook';
// import { Pen } from './Pen';
// import { Product } from './Product';

import { Checkout } from './Checkout';
import {
	EmailService,
	INotificationService,
	PushNotificationService,
	SMSService,
} from './Notification';
import {
	ApplePayPaymentProcessor,
	PayPalPaymentProcessor,
	SSLCommerzPaymentProcessor,
	StripePaymentProcessor,
} from './Payment';

// const inventoryManager = new InventoryManager();

// inventoryManager.addProduct(
// 	new Book(
// 		'id1',
// 		'First Book',
// 		'Test Author',
// 		500,
// 		10,
// 		'asdasdsad',
// 		100,
// 		'Fiction'
// 	)
// );

// inventoryManager.addProduct(
// 	new Magazine(
// 		'id2',
// 		'First Magazine',
// 		500,
// 		10,
// 		1,
// 		'Test Publisher',
// 		new Date()
// 	)
// );

// inventoryManager.addProduct(
// 	new Ebook(
// 		'id3',
// 		'Ebook title 1',
// 		'Test Author',
// 		500,
// 		'https://www.google.com'
// 	)
// );

// inventoryManager.addProduct(
// 	new Ebook(
// 		'id4',
// 		'Ebook title 2',
// 		'Test Author',
// 		500,
// 		'https://www.google.com'
// 	)
// );

// inventoryManager.addProduct(
// 	new Book(
// 		'id5',
// 		'First Book',
// 		'Test Author',
// 		500,
// 		10,
// 		'asdasdsad',
// 		100,
// 		'Fiction'
// 	)
// );

// inventoryManager.addProduct(new AudioBook('id6', 'AudioBook title 1', 500, 10));

// inventoryManager.addProduct(new AudioBook('id7', 'AudioBook title 2', 500, 10));
// inventoryManager.addProduct(new Pen('id8', 'Pen title 1', 500, 10));

// class TestProduct {}

// console.log('\n\n' + inventoryManager.generateInventoryReport() + '\n\n');

// inventoryManager.recordSale('id1', 2);
// inventoryManager.recordSale('id2', 1);
// inventoryManager.recordSale('id3', 2);
// inventoryManager.recordSale('id4', 3);
// inventoryManager.recordSale('id5', 1);

// console.log('\n\n' + inventoryManager.generateSalesReport() + '\n\n');

// console.log('\n\n' + inventoryManager.generateInventoryReport() + '\n\n');

// class NotificationManager {
// 	constructor(private services: INotificationService[]) {}

// 	broadcast(message: string, receiver: string): void {
// 		this.services.forEach((service) => {
// 			service.send(message, receiver);
// 		});
// 	}
// }

// class SlackService implements INotificationService {
// 	send(message: string, receiver: string): boolean {
// 		console.log(`Sending Slack message to ${receiver}: ${message}`);
// 		return true;
// 	}
// }

// const notifier = new NotificationManager([
// 	new EmailService(),
// 	new SMSService(),
// 	new PushNotificationService(),
// 	new SlackService(),
// ]);

// notifier.broadcast('Hello', 'John Doe');

const checkout1 = new Checkout(new StripePaymentProcessor());
const checkout2 = new Checkout(new SSLCommerzPaymentProcessor());
const checkout3 = new Checkout(new ApplePayPaymentProcessor());

async function main() {
	const result1 = await checkout1.completePurchase(100);
	const result2 = await checkout2.completePurchase(100);
	const result3 = await checkout3.completePurchase(100);

	if (result1.success) {
		setTimeout(() => {
			checkout1.handleRefund(result1.transactionId!);
		}, 3000);
	}
}

main();
