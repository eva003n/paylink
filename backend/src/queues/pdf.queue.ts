import { Queue } from "bullmq";
import { getSharedConnection } from "../config/bullmq";
import { JOB_NAMES, QUEUE_NAMES } from "../constants";
import { ReceiptContent } from "../jobs/pdf/receipt.type";

const connection = getSharedConnection()

export const pdfQueue = new Queue(QUEUE_NAMES.PDF, {
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

export const enqueuePaymentReceipt = async(payment: ReceiptContent) => {
  return await pdfQueue.add(JOB_NAMES.PDF_RECEIPT, payment, {
    jobId: payment.reference
  })

} 
