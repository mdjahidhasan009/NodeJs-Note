import {BaseService} from "@/lib/core/BaseService";
import {UsersTable} from "@/db/schemas";
import {UserRepository} from "@/repository/user.repository";

export class UserService extends BaseService<
    typeof UsersTable,
    UserRepository
> {}