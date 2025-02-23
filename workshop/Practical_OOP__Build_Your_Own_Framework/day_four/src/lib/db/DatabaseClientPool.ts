import { Pool } from 'pg';
import {
	DatabaseConfig,
	DrizzleClient,
	IDatabaseClient,
} from './IDatabaseClient';
import * as schema from '@/db/schemas';
import { drizzle } from 'drizzle-orm/node-postgres';

export class DatabaseClientPool implements IDatabaseClient {
	private readonly pool: Pool;
	private readonly client: DrizzleClient;
	private connected = false;

	constructor(config: DatabaseConfig) {
		this.pool = new Pool({
			connectionString: config.url,
			max: config.maxConnection ?? 1,
			idleTimeoutMillis: config.idleTimeout ?? 10000,
			connectionTimeoutMillis: config.connectionTimeout ?? 10000,
			maxUses: config.maxUses ?? 10,
			ssl: config.ssl ?? false,
		});

		this.client = drizzle({ client: this.pool, schema });
	}

	async connect() {
		if (this.connected) return;

		await this.pool.connect();
		this.connected = true;
		console.log('Database connected');
	}

	async disconnect() {
		await this.pool.end();
		this.connected = false;
		console.log('Database disconnected');
	}

	isConnected() {
		return this.connected;
	}

	getClient() {
		return this.client;
	}

	async executeQuery<T>(
		label: string,
		queryFn: (db: DrizzleClient) => Promise<T>
	): Promise<T> {
		const start = performance.now();

		try {
			const result = await queryFn(this.client);
			const duration = performance.now() - start;

			console.log(`[${label}] completed in ${duration.toFixed(2)}ms`);
			return result;
		} catch (error) {
			const duration = performance.now() - start;
			console.error(`[${label}] failed in ${duration.toFixed(2)}ms`);
			console.log(error);

			throw new Error(`[${label}] Database query failed`);
		}
	}
}

async function test() {
	const dbClient = new DatabaseClientPool({
		url: process.env.DATABASE_URL!,
	});

	const books = await dbClient.executeQuery('Find Books', async (db) => {
		return await db.query.BookTable.findMany();
	});
	console.log('Books', books);
}

test();
