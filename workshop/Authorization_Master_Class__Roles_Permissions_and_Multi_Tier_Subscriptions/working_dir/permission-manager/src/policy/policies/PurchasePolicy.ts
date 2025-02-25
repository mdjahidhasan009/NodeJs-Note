import { Policy, PolicyContext, PolicyResult } from '../Policy';

export class PurchasePolicy extends Policy {
	constructor() {
		super('PurchasePolicy', 'Check if the user can purchase a product');
	}

	async can(context: PolicyContext): Promise<PolicyResult> {
		const { userId } = context;
		const blockedUsers = [123, 456, 789];

		if (blockedUsers.includes(userId as number)) {
			return this.denied('User is not allowed to purchase a product');
		}

		return this.allowed();
	}
}
