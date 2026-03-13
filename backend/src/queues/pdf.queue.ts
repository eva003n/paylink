import { Queue } from "bullmq";
import { connection } from "../config/bullmq";

const pdfQueue = new Queue("pdfQueue", {
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
