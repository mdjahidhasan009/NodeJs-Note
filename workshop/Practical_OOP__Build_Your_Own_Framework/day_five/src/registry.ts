import 'reflect-metadata';
import {DatabaseClientPool} from "@/lib/db/DatabaseClientPool";
import {container} from "tsyringe";
import {DatabaseClientToken} from "@/lib/db/IDatabaseClient";

/**
 * For resolving dependencies before the application starts
 */

export async function registerDependencies() {
    try {
        const databaseClient = new DatabaseClientPool({
            url: process.env.DATABASE_URL!,
            maxConnection: 10,
            idleTimeout: 10000,
            connectionTimeout: 1000,
            maxUses: 1000,
            ssl: process.env.NODE_ENV === 'production'
        });

        container.register(DatabaseClientToken, {
            useValue: databaseClient
        })

    } catch (error) {
        console.error(error);
        throw error;
    }
}