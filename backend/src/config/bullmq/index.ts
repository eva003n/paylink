import { Redis } from "ioredis";
import { REDIS_URL } from "../env";
import logger from "../../logger/logger.winston";

const connection = new Redis(REDIS_URL as string, {
  maxRetriesPerRequest: null,
});

connection.on("error", (error) =>
  logger.error(`Bullmq failed to connect to redis: ${error.message}`),
);

export { connection };
