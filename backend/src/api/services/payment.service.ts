import { Link, Merchant, Payment } from "../models/index";
import base62 from "@sindresorhus/base62";
import { linkStatusSchema, FilterOption, PaymentStatus } from "@paylink/shared";
import { sequelize } from "../config/db/postgres";

import { enqueueSTKPush } from "../queues/index";
import { Id, PaymentSTK } from "../../schemas/validators";
import { enqueueSTKPaymentConfirmation } from "../queues";
import { PaymentConfirmation } from "../../schemas/validators";
import logger from "../logger/logger.winston";
import { Client } from "../models/index";
import { paymentsDTO } from "../dto";

export const initiateSTKPush = async ({
  token,
  phoneNumber,
  email,
}: PaymentSTK) => {
  const linkId = base62.decodeString(token);

  // check link info
  const link = await Link.findByPk(linkId);

  if (!link) return { link, transaction: null, invalid: false, job: null };

  if (link.status !== linkStatusSchema.enum.Active) {
    return { link, transaction: null, invalid: true, job: null };
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

  return { link, transaction, invalid: false, job };
};
export const validateMpesaPayment = async () => {};

export const confirmMpesaPayment = async (payment: PaymentConfirmation) => {
  await enqueueSTKPaymentConfirmation(payment);
};

type FilterOptions = {
  status: PaymentStatus;
} & FilterOption;

export const findAllTransactions = async (id: Id, options: FilterOptions) => {
  return getPaginatedPayments(id, options);
};

const getPaginatedPayments = async (id: Id, filtersOptions: FilterOptions) => {
  const offset = (filtersOptions.page - 1) * filtersOptions.limit;

  const filters = {
    merchant_id: id,
    status: filtersOptions.status,
  };

  const where = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v?.toString().trim()),
  );

  const { rows, count } = await Payment.findAndCountAll({
    where,
    limit: filtersOptions.limit,
    offset,
    order: [["createdAt", "DESC"]],
    attributes: [
      "id",
      "status",
      "amount",
      [sequelize.col("mpesa_ref"), "mpesaRef"],
      [sequelize.col("Merchant.business_name"), "businessName"],
      [sequelize.col("Client.email"), "clientName"],
      [sequelize.col("Client.phone_number"), "phoneNumber"],
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Merchant,
        attributes: [],
        required: true,
      },
      {
        model: Client,
        attributes: [],
        required: true,
      },
    ],
  });

  return {
    payments: rows.map((payment) => paymentsDTO.create(payment.dataValues)),
    currentPage: filtersOptions.page,
    totalPages: Math.ceil(count / filtersOptions.limit),
    totalItems: count,
  };
};

export const checkStatus = async (id: Id) => {
  const payment = await Payment.findByPk(id, {
    attributes: [
      "id",
      "status",
      "amount",
      [sequelize.col("mpesa_ref"), "mpesaRef"],
      [sequelize.col("Merchant.business_name"), "businessName"],
      [sequelize.col("Client.email"), "clientEmail"],
      [sequelize.col("Client.phone_number"), "phoneNumber"],
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Merchant,
        attributes: [],
        required: true,
      },
      {
        model: Client,
        attributes: [],
        required: true,
      },
    ],
  });

  return payment;
};
