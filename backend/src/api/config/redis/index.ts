
import IORedis from "ioredis"
import logger from "../../logger/logger.winston";
import { REDIS_URL } from "../env";

// redis connection factory(API, Queues and workers)
export const createRedisConnection = () => {
  return new IORedis(REDIS_URL as string,  {
    maxRetriesPerRequest: null, // required for bull mq
    enableReadyCheck: true,
    retryStrategy:(times) => {
      return Math.min(times * 50, 2000) // exponential retry
    }
  })
}

// this connection is use for api relate use cases
export const redisClient = createRedisConnection()

// ping redis to ensure we are connected
export const ensureRedisConnetion = async () => {
  try {
    await redisClient.ping();
    logger.info("Redis connection verified (PING)");
  } catch (err) {
    logger.error(`Redis connection failed: ${err.message}`);
    process.exit(1); // fail fast
  }
};

export const connectRedis = () => ensureRedisConnetion();


