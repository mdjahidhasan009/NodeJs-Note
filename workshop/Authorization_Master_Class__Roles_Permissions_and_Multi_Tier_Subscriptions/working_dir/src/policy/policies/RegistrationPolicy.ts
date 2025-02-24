import {Policy, PolicyContext, PolicyResult} from "../policy";

export class RegistrationPolicy extends Policy {
    constructor() {
        super('RegistrationPolicy', 'Check if the user can register');
    }

    can(context: PolicyContext): Promise<PolicyResult> {
        const email = context.email as string;
        const blockedDomains = ['test.com', 'example.com'];
        const blockedEmails = ['test@test.com', 'spam@spam.com'];

        if(blockedDomains.some((domain) => email.endsWith(domain))) {
            return Promise.resolve(this.denied('Email domain is blocked'));
        }

        if(blockedEmails.includes(email)) {
            return Promise.resolve(this.denied('Email is blocked'));
        }

        return Promise.resolve(this.allowed());
    }
}