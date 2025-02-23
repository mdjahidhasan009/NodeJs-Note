import {BaseRepository} from "@/lib/core/BaseRepository";
import {BookTable} from "@/db/schemas";
import {inject, injectable} from "tsyringe";
import {DatabaseClientToken, IDatabaseClient} from "@/lib/db/IDatabaseClient";

@injectable()
export class BookRepository extends BaseRepository<typeof BookTable> {
    constructor(
        // tsyringe can not resolve if there is an interface
        @inject(DatabaseClientToken) db: IDatabaseClient,
        // table: typeof BookTable
    ) {
        // super(db, table);
        super(db, BookTable);
    }
}