import { enqueueReceiptEmail } from "../../api/queues/email.queue";
import { generatePDFReceipt } from "./receipt.pdf";
import { ReceiptContent } from "../../schemas/validators";
import logger from "../../api/logger/logger.winston";

export const handleReceiptGeneration = async (content: ReceiptContent) => {
  try {
    // generate pdf receipt
    generatePDFReceipt(content);

    // add email data to email queue
    await enqueueReceiptEmail({ receiver: content.email });
  } catch (error) {
    logger.error(`Error pdf processor: ${error.message}`);
  }
};
