import { Worker } from "bullmq";
import { getSharedConnection } from "../config/bullmq";
import logger from "../logger/logger.winston";

const worker = new Worker("pdfQueue", async () => {}, {
  connection: getSharedConnection().options,
  concurrency: 1,
});

const shutDown = async () => {
  logger.info("Gracefully shutting down pdf worker");
  await worker.close();
  process.exit(0);
};

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);