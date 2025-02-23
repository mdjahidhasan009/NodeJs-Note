import { Controller, Delete, Get, Post, Put, Use } from '@/lib/decorator';
import { PostService } from '@/services/post.service';
import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { FindOptionsSchema } from '@/lib/core/IBaseRepository';

@injectable()
@Controller('/api/v3/posts')
@Use((req, res, next) => {
    res.status(401).json({ message: 'Authentication failed' });
})
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get('/')
    async getPosts(req: Request, res: Response) {
        const parsedQuery = FindOptionsSchema.safeParse(req.query);
        if (!parsedQuery.success) {
            console.log(parsedQuery.error);
            return res.status(400).json({ message: 'Invalid query' });
        }

        const posts = await this.postService.findAll(parsedQuery.data);
        res.status(200).json(posts);
    }

    @Get('/:id')
    async getPostById(req: Request, res: Response) {
        const { id } = req.params;
        const post = await this.postService.findById(id);
        res.status(200).json(post);
    }

    @Post('/')
    async createPost(req: Request, res: Response) {
        const { title, content, userId } = req.body;
        const post = await this.postService.create({
            title,
            content,
            author: userId,
        });
        res.status(201).json(post);
    }

    @Put('/:id')
    async updatePost(req: Request, res: Response) {
        const { id } = req.params;
        const { title, content, status } = req.body;
        const post = await this.postService.update(id, {
            title,
            content,
            status,
        });
        res.status(200).json(post);
    }

    @Delete('/:id')
    async deletePost(req: Request, res: Response) {
        const { id } = req.params;
        await this.postService.delete(id);
        res.status(204).send();
    }
}