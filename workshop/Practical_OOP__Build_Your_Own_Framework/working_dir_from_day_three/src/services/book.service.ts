import {BookRepository} from "@/repository/book.repository";
import {BookTable} from "@/db/schemas";
import {BaseService} from "@/lib/core/BaseService";
import {injectable} from "tsyringe";

@injectable()
export class BookService extends BaseService<
    typeof BookTable,
    BookRepository
> {
    //if we do not use constructor here it will extend the BaseRepository
    constructor(repository: BookRepository) {
        super(repository);
    }
}