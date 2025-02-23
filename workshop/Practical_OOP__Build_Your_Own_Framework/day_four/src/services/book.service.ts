import {BookRepository} from "@/repository/book.repository";
import {BookTable} from "@/db/schemas";
import {BaseService} from "@/lib/core/BaseService";

export class BookService extends BaseService<
    typeof BookTable,
    BookRepository
> {}