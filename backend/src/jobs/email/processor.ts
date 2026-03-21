import logger from "../../logger/logger.winston";
import { sendMail } from "../../mail/email";
import { EmailData } from "./email.types";

export const handleEmail = async (data: EmailData) => {
  try {
    await sendMail(data.receiver);
  } catch (error) {
    logger.error(`Error pdf processor: ${error.message}`);
  }
};
