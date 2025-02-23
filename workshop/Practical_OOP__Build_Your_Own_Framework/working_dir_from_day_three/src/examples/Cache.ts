interface CacheItem<T> {
	value: T; // the value to cache
	ttl: number; // time to live
	timestamp: number; // when the cache was created
}

class CacheManager<T> {
	// In real life we should use Map instead of Record
	private cache: Record<string, CacheItem<T>> = {};

	set(key: string, value: T, ttl = 60 * 1000) {
		this.cache[key] = {
			value,
			ttl,
			timestamp: Date.now(),
		};
	}

	get(key: string): T | undefined {
		const item = this.cache[key];
		if (!item) return undefined;

		if (Date.now() - item.timestamp > item.ttl) {
			delete this.cache[key];
			return undefined;
		}

		return item.value as T;
	}

	invalidate(key: string) {
		delete this.cache[key];
	}

	clear() {
		this.cache = {};
	}
}

type User = {
	id: string;
	name: string;
	isActive: boolean;
};

// Initialize a User-specific cache (TTL defaults to 60 seconds)
const userCache = new CacheManager<User>();

// Add users
userCache.set('user_1', { id: '1', name: 'Alice', isActive: true });
userCache.set('user_2', { id: '2', name: 'Bob', isActive: false });

// Retrieve a user (type-safe!)
const alice = userCache.get('user_1'); // Returns User | undefined
console.log(alice); // "Alice"

type Product = {
	sku: string;
	price: number;
};

const productCache = new CacheManager<Product>();
productCache.set('product_1', { sku: 'P100', price: 99 }, 30000); // TTL = 30 seconds

// Type safety enforced:
const product = productCache.get('product_1');
console.log(product);
