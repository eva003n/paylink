import IORedis from "ioredis";
import { REDIS_URL } from "../env";
import logger from "../../logger/logger.winston";

let sharedRedisConnection: IORedis | null = null;
export function createConnection(): IORedis {
  return new IORedis(REDIS_URL as string, {
    maxRetriesPerRequest: null, // error out faster
    enableReadyCheck: true, // ready validation
  });
}

export const getSharedConnection = (): IORedis => {
  if (!sharedRedisConnection) {
    sharedRedisConnection = createConnection();
    sharedRedisConnection.on("error", (error) =>
      logger.error(`Bullmq failed to connect to redis: ${error.message}`),
    );
  }
  return sharedRedisConnection;
};

export const enableRedisConnetion = async () => {
  const redis = getSharedConnection();
  try {
    await redis.ping();

    logger.info("Redis connection verified (PING)");
  } catch (err) {
    logger.error(`Redis connection failed: ${err.message}`);
    process.exit(1); // fail fast
  }
};
