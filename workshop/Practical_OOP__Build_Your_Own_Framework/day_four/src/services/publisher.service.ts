import {BaseService} from "@/lib/core/BaseService";
import {PublisherTable} from "@/db/schemas";
import {PublisherRepository} from "@/repository/publisher.repository";

export class PublisherService extends BaseService<
    typeof PublisherTable,
    PublisherRepository
> {}