import {Policy, PolicyContext, PolicyResult} from "../policy";

export class FreeTrailPolicy extends Policy {
    constructor() {
        super('FreeTrailPolicy', 'Check if the user can access the free trail');
    }

    can(context: PolicyContext): Promise<PolicyResult> {
        const { userId } = context;

        if(userId === 123) {
            return Promise.resolve(this.denied('User is not allowed to access the free trail'));
        }

        return Promise.resolve(this.allowed());
    }
}