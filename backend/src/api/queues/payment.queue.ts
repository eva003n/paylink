import { Queue } from "bullmq";
import {
  LinkExpiry,
  PaymentConfirmation,
  PaymentData,
  PaymentQuery,
} from "../../schemas/validators";
import { JOB_NAMES, QUEUE_NAMES } from "../constants";
import logger from "../logger/logger.winston";
import { createRedisConnection } from "../config/redis";


export const paymentQueue = new Queue(QUEUE_NAMES.PAYMENT, {
  connection: createRedisConnection().options,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5000, //(earlier was 2000) 10s, 20s, 30s
    },
  },
});

export const enqueueSTKPush = async (paymentData: PaymentData) => {
  return await paymentQueue.add(JOB_NAMES.STK_PUSH, paymentData, {
    jobId: paymentData.transactionId,
  });
};
export const enqueueSTKPoll = async (paymentQuery: PaymentQuery) => {
  const existingJob = await paymentQueue.getJob(paymentQuery.checkoutRequestId)

  if(existingJob) {
    logger.warn(`Job already exists: ${existingJob.id}`);
  }

  return await paymentQueue.add(JOB_NAMES.STK_POLL, paymentQuery, {
    // jobId: paymentQuery.transactionId,
    // delay: 2000
  });
};

// handle payment link expiry
export const enqueuePaymentExpired = async (linkData: LinkExpiry) => {
return await paymentQueue.add(JOB_NAMES.PAYMENT_EXPIRED, linkData, {
  jobId: linkData.linkId,
  delay: linkData.delay // expire link
})
}
export const enqueueSTKPaymentConfirmation = async (
  paymentData: PaymentConfirmation,
) => {
  return await paymentQueue.add(JOB_NAMES.CONFIRM_PAYMENT, paymentData, {
    jobId: paymentData.checkoutRequestId,
  });
};
