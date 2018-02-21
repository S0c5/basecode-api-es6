module.exports = {
  dbUrl: process.env.MONGODB_URI || 'mongodb://mongo/api-proxy',
  redisUrl: process.env.REDIS_URL || 'redis://redis:6379',
  security: {
    token_life: 3000000,
  },
};
