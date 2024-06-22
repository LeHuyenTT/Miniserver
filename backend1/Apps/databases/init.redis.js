const redis = require("redis");

const REDIS_PORT = 6379;
const REDIS_HOST = 'redis';
const client = redis.createClient ({
  host: REDIS_HOST, 
  port: REDIS_PORT,
  family: 4
});

client.on('error', err => {
  console.error('Redis Client Error:', err);
});

client.on('connect', () => {
  console.log('Redis client connected');
});

module.exports = client;
