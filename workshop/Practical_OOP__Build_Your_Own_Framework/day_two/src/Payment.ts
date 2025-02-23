// Process Payment
// Refund Payment

export type PaymentResult = {
	success: boolean;
	transactionId?: string;
	error?: string;
};

export type RefundResult = PaymentResult & {
	refundedAmount: number;
};

export interface IPaymentProcessor {
	processPayment(amount: number, currency: string): Promise<PaymentResult>;
	refundPayment(transactionId: string): Promise<RefundResult>;
}

export class StripePaymentProcessor implements IPaymentProcessor {
	async processPayment(
		amount: number,
		currency: string
	): Promise<PaymentResult> {
		// todo: implement payment processing logic
		// CALL STRIPE API
		// RETURN SUCCESS OR FAILURE
		const result = await this.callStripeApi(amount, currency);
		console.log(`[Stripe] Processing payment of ${amount} ${currency}`);
		return result;
	}

	async refundPayment(transactionId: string): Promise<RefundResult> {
		// todo: implement refund processing logic
		// CALL STRIPE API
		// RETURN SUCCESS OR FAILURE
		console.log(`[Stripe] Refunding payment of ${transactionId}`);
		return { success: true, refundedAmount: 100, transactionId: '1234567890' };
	}

	private async callStripeApi(
		amount: number,
		currency: string
	): Promise<PaymentResult> {
		// todo: implement payment processing logic
		// CALL STRIPE API
		// RETURN SUCCESS OR FAILURE
		console.log(`[Stripe] Processing payment of ${amount} ${currency}`);
		return { success: true, transactionId: '1234567890' };
	}
}

export class PayPalPaymentProcessor implements IPaymentProcessor {
	async processPayment(
		amount: number,
		currency: string
	): Promise<PaymentResult> {
		// todo: implement payment processing logic
		// CALL PAYPAL API
		// RETURN SUCCESS OR FAILURE
		console.log(`[PayPal] Processing payment of ${amount} ${currency}`);
		return { success: true, transactionId: '1234567890' };
	}

	async refundPayment(transactionId: string): Promise<RefundResult> {
		// todo: implement refund processing logic
		// CALL PAYPAL API
		// RETURN SUCCESS OR FAILURE
		console.log(`[PayPal] Refunding payment of ${transactionId}`);
		return { success: true, refundedAmount: 100, transactionId: '1234567890' };
	}
}

export class SSLCommerzPaymentProcessor implements IPaymentProcessor {
	async processPayment(
		amount: number,
		currency: string
	): Promise<PaymentResult> {
		// todo: implement payment processing logic
		// CALL SSLCOMMERZ API
		// RETURN SUCCESS OR FAILURE
		console.log(`[SSLCommerz] Processing payment of ${amount} ${currency}`);
		return { success: true, transactionId: '1234567890' };
	}

	async refundPayment(transactionId: string): Promise<RefundResult> {
		// todo: implement refund processing logic
		// CALL SSLCOMMERZ API
		// RETURN SUCCESS OR FAILURE
		console.log(`[SSLCommerz] Refunding payment of ${transactionId}`);
		return { success: true, refundedAmount: 100, transactionId: '1234567890' };
	}
}

export class ApplePayPaymentProcessor implements IPaymentProcessor {
	async processPayment(
		amount: number,
		currency: string
	): Promise<PaymentResult> {
		console.log(`[ApplePay] Processing payment of ${amount} ${currency}`);
		return { success: true, transactionId: '1234567890' };
	}

	async refundPayment(transactionId: string): Promise<RefundResult> {
		console.log(`[ApplePay] Refunding payment of ${transactionId}`);
		return { success: true, refundedAmount: 100, transactionId: '1234567890' };
	}
}
