import {BaseRepository} from "@/lib/core/BaseRepository";
import {BookTable} from "@/db/schemas";

export class BookRepository extends BaseRepository<typeof BookTable> {

}