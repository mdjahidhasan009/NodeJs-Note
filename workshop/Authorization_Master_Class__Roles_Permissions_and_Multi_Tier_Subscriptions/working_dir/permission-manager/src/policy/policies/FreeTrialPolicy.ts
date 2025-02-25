import { Policy, PolicyContext, PolicyResult } from '../Policy';

export class FreeTrialPolicy extends Policy {
	constructor() {
		super('FreeTrialPolicy', 'Check if the user can access the free trial');
	}

	async can(context: PolicyContext): Promise<PolicyResult> {
		const { userId } = context;

		if (userId === 123) {
			return this.denied('User is not allowed to access the free trial');
		}

		return this.allowed();
	}
}
