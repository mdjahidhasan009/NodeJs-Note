import {BaseService} from "@/lib/core/BaseService";
import {UsersTable} from "@/db/schemas";
import {UserRepository} from "@/repository/user.repository";
import {injectable} from "tsyringe";
import {Email} from "@/lib/Email";
import {Logger} from "@/lib/Logger";

@injectable()
export class UserService extends BaseService<
    typeof UsersTable,
    UserRepository
> {
    constructor(
        readonly repository: UserRepository,
        private readonly email: Email,
        private readonly logger: Logger
    ) {
        super(repository)
    }

    async forgetPassword(userId: string) {
        try {
            const user = await this.repository.findById(userId);

            if(!user) {
                throw new Error('User not found');
            }

            const token = `${Math.random()}`;
            await this.email.send(user.email, token);
        } catch (e) {
            this.logger.error('Failed to send email, problem with email service');
            this.handleError(e);
        }
    }
}