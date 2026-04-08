import nodemailer from "nodemailer";
import {
  ETHEREAL_PASSWORD,
  ETHEREAL_USERNAME,
  NODE_ENV,
  PROD_SMTP_MAIL_SERVER,
  PROD_SMTP_MAIL_SERVER_PORT,
  SMTP_MAIL_SERVER,
  SMTP_MAIL_SERVER_PORT,
} from "../config/env";
import logger from "../logger/logger.winston";
import { getAbsolutePath } from "../utils";
import { template } from "./template";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const config: SMTPTransport.Options = {
  host: NODE_ENV === "production" ? PROD_SMTP_MAIL_SERVER : SMTP_MAIL_SERVER,
  port: parseInt(
    (NODE_ENV === "production"
      ? PROD_SMTP_MAIL_SERVER_PORT
      : SMTP_MAIL_SERVER_PORT) as string,
  ),
  secure: SMTP_MAIL_SERVER_PORT === "465",
  auth: {
    user: ETHEREAL_USERNAME,
    pass: ETHEREAL_PASSWORD,
  },
};
// create transporter
const transporter = nodemailer.createTransport(config);

export const sendMail = async (receiver: string) => {
  const info = await transporter.sendMail({
    from: "paylink@ethereal.email",
    to: receiver,
    subject: "Payment Confirmation – Receipt Attached",
    html: template(receiver.split("@")[0]),
    attachments: [
      {
        filename: "receipt.pdf",
        path: getAbsolutePath("../../public/doc/receipt.pdf", __dirname),
      },
    ],
  });

  logger.info(`Email message sent ID:${info.messageId}`);
};
