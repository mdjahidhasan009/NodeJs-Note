import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import config from 'config';
import * as schema from './schemas';

const db = drizzle(config.get('database_url') as string, { schema });

export default db;
