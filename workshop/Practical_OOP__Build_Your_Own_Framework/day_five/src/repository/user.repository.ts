import {BaseRepository} from "@/lib/core/BaseRepository";
import {UsersTable} from "@/db/schemas";
import {inject, injectable} from "tsyringe";
import {DatabaseClientToken, IDatabaseClient} from "@/lib/db/IDatabaseClient";

@injectable()
export class UserRepository extends BaseRepository<typeof UsersTable> {
    constructor(
        // tsyringe can not resolve if there is an interface
        @inject(DatabaseClientToken) db: IDatabaseClient,
        // table: typeof UsersTable
    ) {
        // super(db, table);
        super(db, UsersTable);
    }
}