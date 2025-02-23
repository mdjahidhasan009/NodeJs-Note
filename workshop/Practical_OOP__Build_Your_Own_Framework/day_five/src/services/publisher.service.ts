import {BaseService} from "@/lib/core/BaseService";
import {PublisherTable} from "@/db/schemas";
import {PublisherRepository} from "@/repository/publisher.repository";
import {injectable} from "tsyringe";

@injectable()
export class PublisherService extends BaseService<
    typeof PublisherTable,
    PublisherRepository
> {
    constructor(repository: PublisherRepository) {
        super(repository);
    }
}