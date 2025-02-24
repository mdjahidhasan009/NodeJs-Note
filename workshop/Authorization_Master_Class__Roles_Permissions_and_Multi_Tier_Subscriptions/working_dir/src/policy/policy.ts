export interface PolicyResult {
    allowed: boolean;
    name: string;
    reason?: string;
}

export interface PolicyContext extends Record<string, unknown> {
    userId?: string | number;
    roles?: string[];
    permissions?: string[];
    featureFlags?: Record<string, boolean>;
}

export abstract class Policy {
    constructor(
        public readonly name: string,
        public readonly description: string
    ) {}

    abstract can(context: PolicyContext): PolicyResult | Promise<PolicyResult>;
    // abstract can(context: PolicyContext, metadata?: unknown): PolicyResult | Promise<PolicyResult>;

    protected allowed(): PolicyResult {
        return { allowed: true, name: this.name };
    }

    protected denied(reason?: string): PolicyResult {
        return { allowed: false, name: this.name, reason };
    }
}

export class PolicyGroup {
    constructor(private readonly policies: Policy[]) {}

    async can(context: PolicyContext): Promise<PolicyResult> {
        for (const policy of this.policies) {
            const result = await policy.can(context);
            if (!result.allowed) {
                return result;
            }
        }
        return { allowed: true, name: 'PolicyGroup' };
    }

    async canAny(context: PolicyContext): Promise<PolicyResult> {
        for (const policy of this.policies) {
            const result = await policy.can(context);
            if (result.allowed) {
                return result;
            }
        }
        return { allowed: false, name: 'PolicyGroup' };
    }

    async evaluateAll(context: PolicyContext): Promise<PolicyResult[]> {
        return Promise.all(this.policies.map((policy) => policy.can(context)));
    }
}

export class PolicyBuilder {
    private policies: Policy[] = [];

    private constructor() {}

    static create(): PolicyBuilder {
        return new PolicyBuilder();
    }

    addPolicy(policy: Policy): PolicyBuilder {
        this.policies.push(policy);
        return this;
    }

    addManyPolicies(policies: Policy[]): PolicyBuilder {
        this.policies.push(...policies);
        return this;
    }

    build(): PolicyGroup {
        return new PolicyGroup(this.policies);
    }
}