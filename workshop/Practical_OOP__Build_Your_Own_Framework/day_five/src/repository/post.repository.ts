import { BaseRepository } from '@/lib/core/BaseRepository';
import { inject, injectable } from 'tsyringe';
import { PostTable } from '@/db/schemas/post';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';

@injectable()
export class PostRepository extends BaseRepository<typeof PostTable> {
    constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
        super(db, PostTable);
    }
}