import { createClient, RedisClientType } from "redis";
import { RedisStore } from "connect-redis";
import logger from "../../logger/logger.winston";
import { REDIS_URL } from "../env";

export const redisClient: RedisClientType = createClient({
  url: REDIS_URL,
});

export const redisStore = new RedisStore({
  client: redisClient,
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info("Successfully connected to redis");
  } catch (error) {
    logger.error(`Error connecting to redis: ${error.message}`);
  }
};
