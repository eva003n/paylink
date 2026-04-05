import { Link, LinkStatus, Payment } from "../../models/index";
import base62 from "@sindresorhus/base62";

import { enqueueSTKPush } from "../../queues/index";
import { PaymentSTK } from "../../schemas/validators";
import { enqueueSTKPaymentConfirmation } from "../../queues/payment.queue";
import { PaymentConfirmation } from "../../jobs/payment/payment.type";
import logger from "../../logger/logger.winston";
import { Client } from "../../models/index";

export const initiateSTKPush = async ({
  token,
  phoneNumber,
  email,
}: PaymentSTK) => {
  const linkId = base62.decodeString(token);

  // check link info
  const link = await Link.findByPk(linkId);

  if (!link) return { link, invalid: false, job: null };

  if (link.status !== LinkStatus.ACTIVE) {
    return { link, invalid: true, job: null };
  }

  // create client
  const client = await Client.create({
    email,
    phone_number: phoneNumber,
    merchant_id: link.merchant_id,
  });

  // if(!client)  {
  //   return { link, invalid: true, job: null };

  // }
  // create transaction
  const transaction = await Payment.create({
    link_id: link.id,
    amount: link.amount,
    phone_number: phoneNumber,
    email: email,
    checkout_request_id: "",
    merchant_id: link.merchant_id,
    client_id: client.id,
  });

  const job = await enqueueSTKPush({
    phoneNumber,
    transactionId: transaction.id,
    amount: Math.round(Number(link.amount)),
    shortCode: link.shortCode,
  });

  logger.info(`Enqueued STK push for Phone: ${phoneNumber}`);

  return { link, invalid: false, job };
};
export const validateMpesaPayment = async () => {};

export const confirmMpesaPayment = async (payment: PaymentConfirmation) => {
  await enqueueSTKPaymentConfirmation(payment);
};
