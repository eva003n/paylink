import { Queue } from "bullmq";
import { getSharedConnection } from "../config/bullmq";
import { PaymentData } from "../jobs/payment/payment.type";
import { JOB_NAMES, QUEUE_NAMES } from "../constants";
import { MpesaSTKFailed, MpesaSTKSuccess } from "../api/middlewares/validators";

const connection = getSharedConnection()

 export const paymentQueue = new Queue<PaymentData>(QUEUE_NAMES.PAYMENT, {
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
  return paymentQueue.add(JOB_NAMES.STKPUSH, paymentData)
 }
 export const enqueueSTKPayment = (paymentData: MpesaSTKSuccess | MpesaSTKFailed) => {

 }