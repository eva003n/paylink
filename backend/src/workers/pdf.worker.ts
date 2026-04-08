import { Job, Worker } from "bullmq";
import { getSharedConnection } from "../api/config/bullmq";
import logger from "../api/logger/logger.winston";
import { JOB_NAMES, QUEUE_NAMES } from "../api/constants";
import { handleReceiptGeneration } from "../jobs/pdf/processors";
import { ReceiptContent } from "../schemas/validators";

const worker = new Worker(
  QUEUE_NAMES.PDF,
  async (job: Job<ReceiptContent>) => {
    switch (job.name) {
      case JOB_NAMES.PDF_RECEIPT:
        return await handleReceiptGeneration(job.data);

      default:
        throw new Error(`Unknown job in pdf worker: ${job.name}`);
    }
  },
  {
    connection: getSharedConnection().options,
    concurrency: 1,
  },
);

const shutDown = async () => {
  logger.info("Gracefully shutting down pdf worker");
  await worker.close();
  process.exit(0);
};

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
