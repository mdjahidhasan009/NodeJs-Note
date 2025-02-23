import {BaseRepository} from "@/lib/core/BaseRepository";
import {PublisherTable} from "@/db/schemas";
import {inject, injectable} from "tsyringe";
import {DatabaseClientToken, IDatabaseClient} from "@/lib/db/IDatabaseClient";

@injectable()
export class PublisherRepository extends BaseRepository<typeof PublisherTable> {
    constructor(
        // tsyringe can not resolve if there is an interface
        @inject(DatabaseClientToken) db: IDatabaseClient,
        // table: typeof PublisherTable
    ) {
        // super(db, table);
        super(db, PublisherTable);
    }
}