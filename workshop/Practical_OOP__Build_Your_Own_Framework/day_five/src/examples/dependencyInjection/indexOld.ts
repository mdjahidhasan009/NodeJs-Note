/**
 * A dependency container
 * Stores and manages object instances
 * Creates objects when needed
 * Reduces manual wiring of dependencies
 */

import 'reflect-metadata';

import { singleton, injectable, container, inject} from "tsyringe";

@singleton()
class Database {
    constructor() {
        console.log('Database instance created');
    }

    query(sql: string) {
        console.log(`Querying ${sql}`);
    }
}

@singleton()
class Cache {
    constructor() {
        console.log('Cache instance created');
    }

    get(key: string) {
        console.log(`Getting value for key ${key}`);
    }

    set(key: string, value: any) {
        console.log(`Setting value for key ${key}`);
    }
}

@singleton()
class Logger {
    constructor() {
        console.log('Logger instance created');
    }

    log(message: string) {
        console.log(`Logging: ${message}`);
    }
}

// router, controller should be singleton, but for any case we need to track any state at controller then we can make
// controller as injectable

// Service should be injectable

@injectable()
class UserService {
    constructor(
        private db: Database,
        private cache: Cache,
        private logger: Logger
    ) {
        console.log('UserService instance created');
    }

    getUser(id: number) {
        this.logger.log(`Fetching user with id ${id}`);
        this.db.query(`SELECT * FROM users WHERE id = ${id}`);
        this.cache.set(`user_${id}`, { id, name: 'John Doe' });
        return { id, name: 'John Doe' };
    }
}

@injectable()
class OrderService {
    constructor(
        private db: Database,
        private logger: Logger,
        private userService: UserService
    ) {
        console.log('OrderService instance created');
    }

    placeOrder(userId: number, item: number) {
        this.logger.log(`Placing order for user ${userId} : ${item}`);
        this.userService.getUser(userId);
        this.db.query(
            `INSERT INTO orders (user_id, item_id) VALUES (${userId}, ${item})`
        )

        return { userId, item };
    }
}

// /orders/place
// const db = new Database();
// const cache = new Cache();
// const logger = new Logger();
//
// const userService = new UserService(db, cache, logger);
// const orderService = new OrderService(db, logger, userService);
//
// orderService.placeOrder(123, 13);


const orderService = container.resolve(OrderService);
orderService.placeOrder(123, 13);

console.log('\n\n ===================== \n\n');

// Get user:/users/123
const userService = container.resolve(UserService);
userService.getUser(123);

