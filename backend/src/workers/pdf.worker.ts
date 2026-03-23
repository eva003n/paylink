import { Job, Worker } from "bullmq";
import { getSharedConnection } from "../config/bullmq";
import logger from "../logger/logger.winston";
import { JOB_NAMES, QUEUE_NAMES } from "../constants";
import { handleReceiptGeneration } from "../jobs/pdf/processors";
import { ReceiptContent } from "../jobs/pdf/receipt.type";

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
