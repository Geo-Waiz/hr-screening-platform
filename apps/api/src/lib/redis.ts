import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function connectRedis() {
  try {
    await redis.ping();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error;
  }
}

redis.on('error', (error) => {
  console.error('Redis error:', error);
});

export default redis;
