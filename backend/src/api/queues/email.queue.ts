import { Queue } from "bullmq";
import { getSharedConnection } from "../config/bullmq";
import { JOB_NAMES, QUEUE_NAMES } from "../constants";
import { randomUUID } from "crypto";
import { EmailData } from "../../schemas/validators";

const connection = getSharedConnection();

const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
  connection: connection.options,
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
