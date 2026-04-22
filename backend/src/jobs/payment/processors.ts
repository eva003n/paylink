import {
  NODE_ENV,
  PROD_MPESA_EXPRESS_PASSKEY,
  MPESA_EXPRESS_SANDBOX_PASSKEY,
  PROD_MPESA_EXPRESS_CALLBACK_URL,
  MPESA_EXPRESS_SANDBOX_CALLBACK_URL,
  MPESA_SANDBOX_SHORTCODE,
  MPESA_SANDBOX_PARTYA,
} from "../../api/config/env";
import { mpesaClient } from "../../api/config/mpesa/mpesaclient";
import { getTimeStamp } from "../../api/utils";
import {
  Id,
  PaymentConfirmation,
  PaymentData,
  PaymentQuery,
} from "../../schemas/validators";
import logger from "../../api/logger/logger.winston";
import {
  PaymentSTKQueryResponse,
  PaymentSTKResponse,
} from "../../schemas/validators";
import { Client, Link, Merchant, Payment } from "../../api/models";
import { enqueueSTKPoll, enqueuePaymentReceipt } from "../../api/queues";
import { paymentStatusSchema, TX } from "@paylink/shared";
import { Op } from "sequelize";
import {sequelize} from "../../api/config/db/postgres";

export const handleMpesaSTKPush = async (paymentData: PaymentData) => {
  const shortCode =
    NODE_ENV === "production" ? paymentData.shortCode : MPESA_SANDBOX_SHORTCODE;
  const passkey =
    NODE_ENV === "production"
      ? PROD_MPESA_EXPRESS_PASSKEY
      : MPESA_EXPRESS_SANDBOX_PASSKEY;
  const timeStamp = getTimeStamp();

  //create a transaction before hand the used the transactions id as the account reference

  // Shortcode+Passkey+Timestamp
  const base64String = Buffer.from(
    `${shortCode}${passkey}${timeStamp}`,
  ).toString("base64");

  let payload = {
    BusinessShortCode: shortCode, // mearchants's shortcode
    Password: base64String,
    Timestamp: timeStamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(paymentData.amount), // amount to be paid by customer
    PartyA:
      NODE_ENV === "production"
        ? paymentData.phoneNumber
        : MPESA_SANDBOX_PARTYA, // customers phone number
    PartyB: shortCode,
    PhoneNumber: paymentData.phoneNumber, // to receive ussd prompt
    CallBackURL:
      NODE_ENV === "production"
        ? PROD_MPESA_EXPRESS_CALLBACK_URL
        : MPESA_EXPRESS_SANDBOX_CALLBACK_URL,
    AccountReference: paymentData.phoneNumber,
    TransactionDesc: "Make online payment",
  };

  try {
    const response = await mpesaClient.request<PaymentSTKResponse, any>(
      "POST",
      "/stkpush/v1/processrequest",
      JSON.stringify(payload),
    );
    const code = response.ResponseCode;
    if (code == 0) {
      logger.info(
        `STP push to PhoneNumber:${paymentData.phoneNumber} successfull`,
      );

      // if request suecessfull add  checkoutrequestid and add to queue for STK query
      const transaction = await Payment.findByPk(paymentData.transactionId);

      if (!transaction) {
        logger.error(
          `Transaction with ID ${paymentData.transactionId} doesn't exist`,
        );
        return;
      }
      transaction?.set("checkout_request_id", response.CheckoutRequestID);
      await transaction?.save();

      // Validate checkout_request_id exists before enqueueing
      if (!transaction.checkout_request_id) {
        logger.error(
          `Cannot enqueue STK poll: checkout_request_id is missing for transaction ${transaction.id}`,
        );
        return;
      }

      await enqueueSTKPoll(
        {
          transactionId: transaction.id,
          shortCode: paymentData.shortCode,
          checkoutRequestId: transaction.checkout_request_id,
          //     attempts: 1,
        },
        60000, // poll after 30 or 60 seconds when status is available to avoid busy waiting
      );

      logger.info(`Enqueued STK poll for transaction ${transaction.id}`);
    } else {
      logger.error(
        `STP push to PhoneNumber:${paymentData.phoneNumber} failed with response code: ${code}. ResponseDesc: ${response.ResponseDescription}`,
      );
    }
  } catch (error) {
    logger.error(
      ` Mpesa Stk push to PhoneNumber: ${paymentData.phoneNumber} failed with Error:${error.message},`,
    );
    throw new Error(error);
  }
};

export const handleMpesaSTKPoll = async (paymentQuery: PaymentQuery) => {
  const shortCode = (
    NODE_ENV === "production"
      ? paymentQuery.shortCode
      : parseInt(MPESA_SANDBOX_SHORTCODE as string)
  ) as number;
  const passkey = (
    NODE_ENV === "production"
      ? PROD_MPESA_EXPRESS_PASSKEY
      : MPESA_EXPRESS_SANDBOX_PASSKEY
  ) as string;
  const timeStamp = getTimeStamp();

  const base64String = Buffer.from(
    `${shortCode}${passkey}${timeStamp}`,
  ).toString("base64");

  const payload = {
    BusinessShortCode: shortCode,
    Password: base64String,
    Timestamp: timeStamp,
    CheckoutRequestID: paymentQuery.checkoutRequestId,
  };

  try {
    const response = await mpesaClient.request<PaymentSTKQueryResponse, string>(
      "POST",
      "/stkpushquery/v1/query",
      JSON.stringify(payload),
    );

    const transaction = await Payment.findByPk(paymentQuery.transactionId, {
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
    if (!transaction) {
      logger.error(
        `Transaction with ID ${paymentQuery.transactionId} doesn't exist`,
      );
      return;
    }

    // const client = await Client.findByPk(transaction.client_id);
    // if (!client) {
    //   logger.error(`Client with ID ${transaction.client_id} doesn't exist`);
    //   return;
    // }

    const code = Number(response.ResultCode);
    if (code == 0) {
      logger.info(
        `Mpesa express query successfulL CheckoutID: ${response.CheckoutRequestID} `,
      );

      transaction.set("status", paymentStatusSchema.enum.Completed);

      /*       const link = await Link.findByPk(transaction.link_id)
      if(!link) {
        logger.error(`Link with ID: ${transaction.link_id} does not exists `)
        return
      }
// update link status 
      link.set("status", linkStatusSchema.enum.Paid)
      await link.save() */

      const tx: TX = transaction as Payment as any;
      // generate payment receipt pdf
      await enqueuePaymentReceipt({
        email: tx.clientEmail,
        phoneNumber: tx.phoneNumber,
        reference: transaction.mpesa_ref,
        amount: Number(tx.amount),
        paymentType: "CustomerPayBillOnline",
        paybill: shortCode,
        businessName: tx.businessName,
        date: tx.updatedAt?.toString(),
        status: tx.status,
      });
    } else {
      // user cancelled the prompt
      if (code == 1032)
        transaction.set("status", paymentStatusSchema.enum.Cancelled);

      // if user hasn't acted on prompt
      if (code === 1037)
        transaction.set("status", paymentStatusSchema.enum.Failed);
    }

    // update transaction status
    await transaction.save();
    logger.info(
      `Transaction ID: ${transaction?.id} Status: ${transaction?.status}`,
    );
  } catch (error) {
    logger.error(`Error while making stk query request:${error.message}`);
    throw new Error(error);
  }
};

export const handlePaymentConfirmation = async (
  payment: PaymentConfirmation,
) => {
  try {
    console.log(payment);

    const transaction = await Payment.findOne({
      where: { checkout_request_id: payment.checkoutRequestId },
    });

    if (!transaction) {
      logger.error(
        `Payment with CheckoutRequestId: ${payment.checkoutRequestId} doesn't exists `,
      );
      return;
    }

    const reference = payment.mpesaReference ? payment.mpesaReference : "N/A";
    transaction.set("mpesa_ref", reference);
    await transaction.save();

    const link = await Link.findByPk(transaction.link_id);
    if (!link) {
      logger.error(`Link with ID: ${transaction.link_id} doesn't exists `);
      return;
    }

    // Validate checkout_request_id exists before enqueueing
    if (!transaction.checkout_request_id) {
      logger.error(
        `Cannot enqueue STK poll: checkout_request_id is missing for transaction ${transaction.id}`,
      );
      return;
    }

    // query payment status(becomes the source of truth for payment status)
    /*    setTimeout(() => {
      enqueueSTKPoll({
       transactionId: transaction.id,
       shortCode: link.shortCode,
       checkoutRequestId: transaction.checkout_request_id,
       attempts: 1,
     }); 

  }, 2000);
  */

    logger.info(`Enqueued STK poll for transaction ${transaction.id}`);
  } catch (error) {
    logger.error(
      `Error confirming payment CheckoutRequestId: ${payment.checkoutRequestId}`,
      {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    );
    throw new Error(error);
  }
};

export const updateTransactionStatus = async (txId: Id) => {
  const transaction = await Payment.findOne({
    where: {
      [Op.or]: [
        {
          checkout_request_id: txId,
        },
        {
          id: txId,
        },
      ],
    },
  });
  if (!transaction) {
    logger.error(
      `Payment with CheckoutRequestId | ID: ${txId} doesn't exists `,
    );
    return;
  }
  transaction.set("status", paymentStatusSchema.enum.Failed);
  await transaction.save();
};
