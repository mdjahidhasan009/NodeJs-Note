import express, { Application, NextFunction, Response, Request } from 'express';

const app: Application = express();

app.use(express.json());

app.get('/health', (_req, res) => {
    res.status(200).json({
        message: 'ok'
    });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
        message: 'Internal Server Error',
    });
});

export default app;