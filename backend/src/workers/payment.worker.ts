import { Worker } from "bullmq";
import { JOB_NAMES, QUEUE_NAMES } from "../api/constants";
import {
  handleLinkExpiry,
  handleMpesaSTKPoll,
  handleMpesaSTKPush,
  handlePaymentConfirmation,
} from "../jobs/payment/processors";
import logger from "../api/logger/logger.winston";
import { connectDb, sequelize } from "../api/config/db/postgres";
import { connectRedis, createRedisConnection } from "../api/config/redis";


// connect postgres
(async () => {
  await connectDb();
  await connectRedis();
  process.send?.("ready"); // start worker process when its connected to external services(db and redis)
})();

const paymentWorker = new Worker(
  QUEUE_NAMES.PAYMENT,
  async (job) => {
    switch (job.name) {
      case JOB_NAMES.STK_PUSH:
        return await handleMpesaSTKPush(job.data);
      case JOB_NAMES.STK_POLL:
        return await handleMpesaSTKPoll(job.data);
      case JOB_NAMES.CONFIRM_PAYMENT:
        return await handlePaymentConfirmation(job.data);
      case JOB_NAMES.PAYMENT_EXPIRED:
        return handleLinkExpiry(job.data);
      default:
        throw new Error(`Unknown job in payment worker: ${job.name}`);
    }
  },
  {
    connection: createRedisConnection().options,
    concurrency: 1, // process on 1 job at a time
    limiter: {
      max: 5, //(earlier was 1) 5 request per minute
      duration: 60000, //(earlier was 12000) 5 request within 1 minute
    },
  },
);

paymentWorker.on("active", (job) => {
  logger.info(`Worker picked up job: ${job.id} with name: ${job.name}`);
});

paymentWorker.on("completed", (job) => {
  logger.info(`Job completed: ${job.id} with name: ${job.name}`);
});

paymentWorker.on("failed", (job, error) => {
  logger.error(`Job failed: ${job?.id} with name: ${job?.name}`, {
    message: error.message,
    stack: error.stack,
  });
});

paymentWorker.on("error", (error) => {
  logger.error(`Worker error:`, { message: error.message, stack: error.stack });
});
// gracefull shutdown of workers(process in flight jobs before exiting)
const shutDown = async () => {
  logger.info(`Gracefully shuting down payment worker`);
  await paymentWorker.close();
  await sequelize.close();
  process.exit(0);
};

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
