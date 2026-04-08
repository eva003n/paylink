import logger from "../../api/logger/logger.winston";
import { sendMail } from "../../api/mail/email";
import { EmailData } from "../../schemas/validators";

export const handleEmail = async (data: EmailData) => {
  try {
    await sendMail(data.receiver);
  } catch (error) {
    logger.error(`Error pdf processor: ${error.message}`);
  }
};
