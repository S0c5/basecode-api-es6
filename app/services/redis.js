import redis from 'redis';

let instance = null;
class RedisClient {
  constructor(...args) {
    if (instance) {
      return instance;
    }
    if (!instance) {
      instance = this;
    }
    this.client = redis.createClient(...args);
    return instance;
  }
}

module.exports = RedisClient;
