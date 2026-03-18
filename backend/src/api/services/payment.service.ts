import { Link, Payment } from "../../models/index";
import base62 from "@sindresorhus/base62";

import { enqueueSTKPush } from "../../queues/index";

export const initiateSTKPush = async ({
  token,
  phoneNumber,
}: {
  token: string;
  phoneNumber: string;
}) => {
  const linkId = base62.decodeString(token);

  // check link info
  const link = await Link.findByPk(linkId);

  if (!link) return { link, invalid: false, job: null };

  if (link.status !== "active") {
    return { link, invalid: true, job: null };
  }

  // create transaction
  const transaction = await Payment.create({
    link_id: link.id,
    amount: 0,
    phone_number: phoneNumber,
    checkout_request_id: "",
    merchant_id: link.merchant_id,
  });

  const job = await enqueueSTKPush({
    phoneNumber,
    transactionId: transaction.id,
    amount: Math.round(Number(link.amount)),
    shortCode: link.shortCode,
  });

  return { link, invalid: false, job };
};
export const validateMpesaPayment = async () => {};

export const confirmMpesaPayment = async () => {};
