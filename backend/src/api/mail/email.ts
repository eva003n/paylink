import nodemailer from "nodemailer";
import {
  APP_EMAIL,
  SMTP_PASSWORD,
  SMTP_USERNAME,

  SMTP_MAIL_SERVER,
  SMTP_MAIL_SERVER_PORT,
} from "../config/env";
import logger from "../logger/logger.winston";
import { getAbsolutePath } from "../utils";
import { template } from "./template";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const config: SMTPTransport.Options = {
  host: SMTP_MAIL_SERVER,
  port: parseInt(SMTP_MAIL_SERVER_PORT as string),
  secure: Number(SMTP_MAIL_SERVER_PORT ) === 465,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
};
// create transporter
const transporter = nodemailer.createTransport(config);

export const sendMail = async (receiver: string) => {
  const info = await transporter.sendMail({
    from: APP_EMAIL,
    to: receiver,
    subject: "Payment Confirmation – Receipt Attached",
    html: template(receiver.split("@")[0]),
    attachments: [
      {
        filename: "receipt.pdf",
        path: getAbsolutePath("../../../public/doc/receipt.pdf", __dirname),
      },
    ],
  });

  logger.info(`Email message sent ID:${info.messageId}`);
};
