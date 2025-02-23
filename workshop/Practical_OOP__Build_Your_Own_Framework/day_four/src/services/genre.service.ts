import {BookGenreTable} from "@/db/schemas";
import {BaseService} from "@/lib/core/BaseService";
import {GenreRepository} from "@/repository/genre.repository";

export class GenreService extends BaseService<
    typeof BookGenreTable,
    GenreRepository
> {}