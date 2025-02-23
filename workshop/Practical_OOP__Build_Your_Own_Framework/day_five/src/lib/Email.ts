import {singleton} from "tsyringe";

@singleton()
export class Email {
    constructor() {}

    async send(email: string, message: string) {
        console.log(`Sending email to ${email}: ${message}`);
    }
}