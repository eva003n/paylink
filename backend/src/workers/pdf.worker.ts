import { Job, Worker } from "bullmq";

import logger from "../api/logger/logger.winston";
import { JOB_NAMES, WORKER_NAMES } from "../api/constants";
import { handleReceiptGeneration } from "../jobs/pdf/processors";
import { ReceiptContent } from "../schemas/validators";
import { connectRedis, createRedisConnection } from "../api/config/redis";
import { connectDb } from "../api/config/db/postgres";

(async () => {
  connectDb()
   connectRedis();
  process.send?.("ready"); // start worker process when its connected to external services(db and redis)
})();

const redisClient = createRedisConnection();

const worker = new Worker(
  WORKER_NAMES.PDF,
  async (job: Job<ReceiptContent>) => {
    switch (job.name) {
      case JOB_NAMES.PDF_RECEIPT:
        return await handleReceiptGeneration(job.data);

      default:
        throw new Error(`Unknown job in pdf worker: ${job.name}`);
    }
  },
  {
    connection: redisClient.options,
    concurrency: 1,
  },
);

worker.on("error", (error) => {
  logger.error(`PDF Worker error: ${error.message}`);
  process.exit(1);
})

const shutDown = async () => {
  logger.info("Gracefully shutting down pdf worker");
  await worker.close();
  await redisClient.quit()
  process.exit(0);
};

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

