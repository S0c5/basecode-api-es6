module.exports = {
  dbUrl: 'mongodb://mongo/api-proxy-staging',
  redisUrl: process.env.REDIS_URL || 'redis://redis:6379',
  security: {
    token_life: 3000000,
  },
};
