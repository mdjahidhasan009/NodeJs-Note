export interface PolicyContext extends Record<string, unknown> {
	userId?: string | number;
	authUserId?: string | number;
	roles?: string[];
	permissions?: string[];
	featureFlags?: string[];
}

export interface PolicyResult {
	name: string;
	allowed: boolean;
	reason?: string;
}

export abstract class Policy {
	constructor(
		public readonly name: string,
		public readonly description: string
	) {}

	abstract can(context: PolicyContext): PolicyResult | Promise<PolicyResult>;

	protected allowed(): PolicyResult {
		return { allowed: true, name: this.name };
	}

	protected denied(reason?: string): PolicyResult {
		return { allowed: false, name: this.name, reason };
	}
}

export class PolicyGroup {
	constructor(
		private readonly name: string,
		private readonly policies: Policy[]
	) {}

	async can(context: PolicyContext): Promise<PolicyResult> {
		for (const policy of this.policies) {
			const result = await policy.can(context);
			if (!result.allowed) {
				return result;
			}
		}
		return { allowed: true, name: this.name };
	}

	async canAny(context: PolicyContext): Promise<PolicyResult> {
		for (const policy of this.policies) {
			const result = await policy.can(context);
			if (result.allowed) {
				return result;
			}
		}
		return { allowed: false, name: this.name, reason: 'No policy allowed' };
	}
}

export class PolicyBuilder {
	private policies: Policy[] = [];
	private name: string;

	private constructor(name: string) {
		this.name = name;
	}

	static create(name: string) {
		return new PolicyBuilder(name);
	}

	addPolicy(policy: Policy) {
		this.policies.push(policy);
		return this;
	}

	addPolicies(policies: Policy[]) {
		this.policies.push(...policies);
		return this;
	}

	build() {
		return new PolicyGroup(this.name, this.policies);
	}
}

const policies = [
	{
		name: 'RegistrationPolicy',
		can: (context: PolicyContext) => {},
	},
	{
		name: 'FreeTrialPolicy',
		can: (context: PolicyContext) => {},
	},
];
