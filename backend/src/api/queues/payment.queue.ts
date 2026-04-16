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
    removeOnComplete: {
      age: 3600, // keep up to i hour
      count: 1000 // limit to 1000 per hour
    },
    removeOnFail: {
      age: 85400,  // (24 * 3600),  keep up to 1 day
      count: 5000 // limit upto 5000 per day 
    },
    attempts: 5, // max retries 
    backoff: {
      type: "exponential",
      delay: 5000, //(earlier was 2000) 5s, 10s, 20s, 30s, 40s
    },
  },
});

export const enqueueSTKPush = async (paymentData: PaymentData) => {
  return await paymentQueue.add(JOB_NAMES.STK_PUSH, paymentData, {
    jobId: paymentData.transactionId,
  });
};
export const enqueueSTKPoll = async (paymentQuery: PaymentQuery, delay?: number) => {
  const existingJob = await paymentQueue.getJob(paymentQuery.checkoutRequestId)

  if(existingJob) {
    logger.warn(`Job already exists: ${existingJob.id}`);
  }

  return await paymentQueue.add(JOB_NAMES.STK_POLL, paymentQuery, {
    jobId: paymentQuery.checkoutRequestId,
    delay: delay || 0
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
