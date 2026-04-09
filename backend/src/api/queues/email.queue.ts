import { Queue } from "bullmq";
import { JOB_NAMES, QUEUE_NAMES } from "../constants";
import { randomUUID } from "crypto";
import { EmailData } from "../../schemas/validators";
import { createRedisConnection } from "../config/redis";


const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
    connection: createRedisConnection().options,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

export const enqueueReceiptEmail = async (receiver: EmailData) => {
  await emailQueue.add(JOB_NAMES.RECEIPT_EMAIL, receiver, {
    jobId: randomUUID(),
  });
};
export { emailQueue };
