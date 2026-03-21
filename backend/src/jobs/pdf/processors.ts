import { enqueueReceiptEmail } from "../../queues/email.queue";
import { generatePDFReceipt } from "./receipt.pdf";
import { ReceiptContent } from "./receipt.type";
import logger from "../../logger/logger.winston";

export const handleReceiptGeneration = async (content: ReceiptContent) => {
   try {
     // generate pdf receipt
     generatePDFReceipt(content);

     // add email data to email queue
     await enqueueReceiptEmail({ receiver: content.email });
   }catch(error) {
    logger.error(`Error pdf processor: ${error.message}`)

   }
}