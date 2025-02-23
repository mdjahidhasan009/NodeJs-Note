export interface INotificationService {
	send(message: string, recipient: string): boolean;
}

export class EmailService implements INotificationService {
	send(message: string, recipient: string): boolean {
		console.log(`Sending email to ${recipient}: ${message}`);
		// Simulate email sending logic
		return Math.random() > 0.1; // 90% success rate
	}
}

export class SMSService implements INotificationService {
	send(message: string, recipient: string): boolean {
		console.log(`Sending SMS to ${recipient}: ${message.substring(0, 160)}`);
		return true; // Always succeeds
	}
}

export class PushNotificationService implements INotificationService {
	send(message: string, deviceToken: string): boolean {
		console.log(`Sending push to ${deviceToken}: ${message}`);
		return navigator.onLine; // Depends on network connection
	}
}
