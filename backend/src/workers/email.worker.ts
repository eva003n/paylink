import { Worker, Job } from "bullmq";

import logger from "../api/logger/logger.winston";
import { JOB_NAMES, QUEUE_NAMES } from "../api/constants";
import { handleEmail } from "../jobs/email/processor";
import { EmailData } from "../schemas/validators";
import { connectRedis, createRedisConnection } from "../api/config/redis";

(
  async() => {
    await connectRedis()
    process.send?.("ready"); // start worker process when its connected to external services(db and redis)
  }
)()
const worker = new Worker(
  QUEUE_NAMES.EMAIL,
  async (job: Job<EmailData>) => {
    switch (job.name) {
      case JOB_NAMES.RECEIPT_EMAIL:
        return await handleEmail(job.data);

      default:
        throw new Error(`Unknown job in email worker: ${job.name}`);
    }
  },
  {
    connection: createRedisConnection().options,
    concurrency: 5,
    limiter: {
      max: 100, // 100 email
      duration: 60000, // per minute
    },
  },
);

const shutDown = async () => {
  logger.info("Gracefully shutting down email worker");
  await worker.close();
  process.exit(0);
};

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
