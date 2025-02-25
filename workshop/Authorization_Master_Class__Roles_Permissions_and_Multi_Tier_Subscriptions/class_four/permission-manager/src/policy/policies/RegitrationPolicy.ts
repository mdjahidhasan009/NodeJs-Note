import { Policy, PolicyContext, PolicyResult } from '../Policy';

export class RegistrationPolicy extends Policy {
	constructor() {
		super('RegistrationPolicy', 'Check if the user can register');
	}

	async can(context: PolicyContext): Promise<PolicyResult> {
		const email = context.email as string;
		const blockedDomains = ['spam.com', 'malicious.com'];
		const blockedEmails = [
			'test@spam.com',
			'test@malicious.com',
			'test@test.com',
		];

		if (blockedDomains.some((domain) => email.endsWith(domain))) {
			return this.denied('Email domain is blocked');
		}

		if (blockedEmails.includes(email)) {
			return this.denied('Email is blocked');
		}

		return this.allowed();
	}
}
