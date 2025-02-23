import {BaseService} from "@/lib/core/BaseService";
import {UsersTable} from "@/db/schemas";
import {UserRepository} from "@/repository/user.repository";
import {Email} from "@/lib/Email";
import {Logger} from "@/lib/Logger";

export class UserService extends BaseService<
	typeof UsersTable,
	UserRepository
> {
	constructor(
		readonly repository: UserRepository, ////TODO: have to check why private is not work here
		private readonly email: Email,
		private readonly logger: Logger
	) {
		super(repository);
	}

	async forgetPassword(userId: string) {
		try {
			const user = await this.repository.findById(userId);
			if (!user) {
				throw new Error('User not found');
			}

			const token = `token_${Math.random()}`;

			// Circuit breaker with retry mechanism
			// As it is third party service, we can't trust it, so we are adding another try catch block
			try {
				await this.email.send(
					user.email,
					`Click here to reset your password: ${token}`,
				);
				this.logger.log('Email sent');
			} catch (error) {
				this.logger.error('Error sending email');
				this.handleError(error);
				// We can add some retry mechanism here
				// We can also use circuit breaker pattern here
			}
		} catch (error) {
			this.handleError(error);
		}
	}
}