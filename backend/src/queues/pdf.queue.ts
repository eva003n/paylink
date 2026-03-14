import { Queue } from "bullmq";
import { getSharedConnection } from "../config/bullmq";
import { QUEUE_NAMES } from "../constants";

const connection = getSharedConnection()

const pdfQueue = new Queue(QUEUE_NAMES.PDF, {
  connection: connection.options,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  }
});

export { pdfQueue };
