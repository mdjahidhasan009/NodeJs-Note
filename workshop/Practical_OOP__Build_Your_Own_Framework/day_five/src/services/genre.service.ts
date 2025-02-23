import {BookGenreTable} from "@/db/schemas";
import {BaseService} from "@/lib/core/BaseService";
import {GenreRepository} from "@/repository/genre.repository";
import {injectable} from "tsyringe";

@injectable()
export class GenreService extends BaseService<
    typeof BookGenreTable,
    GenreRepository
> {
    constructor(repository: GenreRepository) {
        super(repository);
    }
}