const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

const redisClient = redis.createClient(keys.redisUrl);
redisClient.hget = util.promisify(redisClient.hget);
const exec = mongoose.Query.prototype.exec;

//Can not use arrow function here because we need to use 'this' keyword, in arrow function 'this' keyword will
// refer to the context where the function is defined, not where it is executed
mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options?.key || '');

    return this; //to make this function chainable
}

//Can not use arrow function here because we need to use 'this' keyword, in arrow function 'this' keyword will
// refer to the context where the function is defined, not where it is executed
mongoose.Query.prototype.exec = async function () {
    if(!this.useCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    // See if we have a value for 'key' in redis
    const cacheValue = await redisClient.hget(this.hashKey, key);

    // If we do, return that
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);
    await redisClient.hset(this.hashKey, key, JSON.stringify(result));
    await redisClient.expire(this.hashKey, 10);
    return result;
}

module.exports = {
    clearHash(hashKey) {
        redisClient.del(JSON.stringify(hashKey));
    }
}