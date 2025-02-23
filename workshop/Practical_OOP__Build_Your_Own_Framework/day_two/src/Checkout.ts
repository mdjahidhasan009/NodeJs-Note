import { IPaymentProcessor, PaymentResult, RefundResult } from './Payment';

export class Checkout {
	constructor(private paymentProcessor: IPaymentProcessor) {}

	async completePurchase(
		cartTotal: number,
		currency: string = 'USD'
	): Promise<PaymentResult> {
		try {
			const result = await this.paymentProcessor.processPayment(
				cartTotal,
				currency
			);

			if (result.success) {
				console.log(`Purchase completed: ${result.transactionId}`);
				// Update order status in database
			} else {
				console.error(`Payment failed: ${result.error}`);
			}

			return result;
		} catch (error) {
			console.error('Checkout error:', error);
			return { success: false, error: 'System error' };
		}
	}

	async handleRefund(transactionId: string): Promise<RefundResult> {
		console.log(`[Checkout] Refunding transaction ${transactionId}`);
		return this.paymentProcessor.refundPayment(transactionId);
	}
}
