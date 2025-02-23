export class Cache {
    private cache: Record<string, any> = {};
    constructor() {}

    get(key: string) {
        return this.cache[key];
    }

    set(key: string, value: any) {
        this.cache[key] = value;
    }
}