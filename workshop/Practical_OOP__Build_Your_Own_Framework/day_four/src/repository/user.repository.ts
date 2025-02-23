import {BaseRepository} from "@/lib/core/BaseRepository";
import {UsersTable} from "@/db/schemas";

export class UserRepository extends BaseRepository<typeof UsersTable> {

}