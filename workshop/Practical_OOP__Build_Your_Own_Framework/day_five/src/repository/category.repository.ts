import {BaseRepository} from "@/lib/core/BaseRepository";
import {CategoryTable} from "@/db/schemas";
import {inject, injectable} from "tsyringe";
import {DatabaseClientToken, IDatabaseClient} from "@/lib/db/IDatabaseClient";

@injectable()
export class CategoryRepository extends BaseRepository<typeof CategoryTable> {
    constructor(
        // tsyringe can not resolve if there is an interface
        @inject(DatabaseClientToken) db: IDatabaseClient,
        // table: typeof CategoryTable
    ) {
        // super(db, table);
        super(db, CategoryTable);
    }
}