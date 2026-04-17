import { Worker } from "bullmq";
import { JOB_NAMES, WORKER_NAMES } from "../api/constants";
import { connectRedis, createRedisConnection } from "../api/config/redis";
import logger from "../api/logger/logger.winston";
import { updateTransactionStatus } from "../jobs/payment/processors";
import { connectDb } from "../api/config/db/postgres";
import { handleLinkExpiry } from "../jobs/link/processor";

(async () => {
   connectDb();
   connectRedis();

  process.send?.("ready"); // start worker process when its connected to external services(db and redis)
})();

const redisClient = createRedisConnection();

const worker = new Worker(
  WORKER_NAMES.LINK,
  async (job) => {
    switch (job.name) {
      case JOB_NAMES.LINK_EXPIRED:
    return handleLinkExpiry(job.data);
      default:
        throw new Error(`Unknown job in link worker: ${job.name}`);
    }

  },

  {
    connection: redisClient.options,
    concurrency: 1,
  },
);

worker.on("active", (job) => {
  logger.info(`Worker picked up job: ${job.id} with name: ${job.name}`);
});

worker.on("completed", (job) => {
  logger.info(`Job completed: ${job.id} with name: ${job.name}`);
});

worker.on("failed", (job, error) => {
  logger.error(`Job failed: ${job?.id} with name: ${job?.name}`, {
    message: error.message,
    stack: error.stack,
  });
  // after all 5 retries fail mark transaction as failed(mpesa is down or network issue)
  updateTransactionStatus(job?.id as string);
});

worker.on("error", (error) => {
  logger.error(`Payment Worker error: ${error.message}`);
  process.exit(1);
});
// gracefull shutdown of workers(process in flight jobs before exiting)
const shutDown = async () => {
  logger.info(`Gracefully shuting down payment worker`);
  await worker.close();
  await redisClient.quit(); // waits for pending commands to complete
  process.exit(0);
};

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
