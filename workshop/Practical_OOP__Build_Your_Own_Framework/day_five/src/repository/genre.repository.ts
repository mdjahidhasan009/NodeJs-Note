import {BaseRepository} from "@/lib/core/BaseRepository";
import {BookGenreTable} from "@/db/schemas";
import {inject, injectable} from "tsyringe";
import {DatabaseClientToken, IDatabaseClient} from "@/lib/db/IDatabaseClient";

@injectable()
export class GenreRepository extends BaseRepository<typeof BookGenreTable> {
    constructor(
        // tsyringe can not resolve if there is an interface
        @inject(DatabaseClientToken) db: IDatabaseClient,
        // table: typeof BookGenreTable
    ) {
        // super(db, table);
        super(db, BookGenreTable);
    }
}