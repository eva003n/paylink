import { Queue } from "bullmq";
import { getSharedConnection } from "../config/bullmq";
import { PaymentData, PaymentQuery } from "../jobs/payment/payment.type";
import { JOB_NAMES, QUEUE_NAMES } from "../constants";
import { MpesaSTKFailed, MpesaSTKSuccess } from "../api/middlewares/validators";

const connection = getSharedConnection()

 export const paymentQueue = new Queue<PaymentData | PaymentQuery>(QUEUE_NAMES.PAYMENT, {
   connection: connection.options,
   defaultJobOptions: {
     removeOnComplete: true,
     removeOnFail: false,
     attempts: 5,
     backoff: {
       type: "exponential",
       delay: 2000, // 2s, 4s, 8s
     },
   }
 });

 export const enqueueSTKPush = (paymentData: PaymentData) => {
  return paymentQueue.add(JOB_NAMES.STK_PUSH, paymentData, {jobId: paymentData.transactionId})
 }
 export const enqueueSTKPoll = (paymentQuery: PaymentQuery) => {
  return paymentQueue.add(JOB_NAMES.STK_POLL, paymentQuery, {jobId: paymentQuery.transactionId})
 }
 export const enqueueSTKPayment = (paymentData: MpesaSTKSuccess | MpesaSTKFailed) => {

 }