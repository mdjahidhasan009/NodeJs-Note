import { PostTable } from '@/db/schemas';
import { PostRepository } from '@/repository/post.repository';
import { BaseService } from '@/lib/core/BaseService';
import { injectable } from 'tsyringe';

@injectable()
export class PostService extends BaseService<typeof PostTable, PostRepository> {
    constructor(repository: PostRepository) {
        super(repository);
    }
}