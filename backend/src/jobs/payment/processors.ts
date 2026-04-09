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
  LinkExpiry,
  PaymentConfirmation,
  PaymentData,
  PaymentQuery,
} from "../../schemas/validators";
import logger from "../../api/logger/logger.winston";
import {
  PaymentSTKQueryResponse,
  PaymentSTKResponse,
} from "../../schemas/validators";
import { Client, Link, Payment } from "../../api/models";
import { enqueueSTKPoll } from "../../api/queues";
import { enqueuePaymentReceipt } from "../../api/queues/pdf.queue";
import { linkStatusSchema, paymentStatusSchema } from "@paylink/shared";

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

      await enqueueSTKPoll({
        transactionId: transaction.id,
        shortCode: paymentData.shortCode,
        checkoutRequestId: transaction.checkout_request_id,
        attempts: 0,
      },
      60000 // poll after 30 or 60 seconds when status is available to avoid busy waiting
    
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

    const transaction = await Payment.findByPk(paymentQuery.transactionId);
    if (!transaction) {
      logger.error(
        `Transaction with ID ${paymentQuery.transactionId} doesn't exist`,
      );
      return;
    }

    const client = await Client.findByPk(transaction.client_id);
    if (!client) {
      logger.error(`Client with ID ${transaction.client_id} doesn't exist`);
      return;
    }

    const code = response.ResultCode;
    if (code == 0) {
      logger.info(
        `Mpesa express query successfulL CheckoutID: ${response.CheckoutRequestID} `,
      );
      transaction.set("status", paymentStatusSchema.enum.Completed);

      // generate payment receipt pdf
      await enqueuePaymentReceipt({
        name: client.email.split("@")[0],
        email: client.email,
        phoneNumber: client.phone_number,
        reference: transaction.mpesa_ref,
        amount: transaction.amount,
        paymentType: "CustomerPayBillOnline",
        account: client.phone_number,
        paybill: shortCode,
      });
    }

    // if user hasn't acted or canceled request
    if (code > 0) {
        // requeue only when transaction is pending and max attempts is not reached

      if (
        transaction.status == paymentStatusSchema.enum.Pending &&
        paymentQuery.attempts < 5
      ) {
        enqueueSTKPoll({
          ...paymentQuery,
          attempts: paymentQuery.attempts + 1,
        });

        logger.info(
          `Re-enqueued STK poll for transaction ${transaction.id}`,
        );
      } else {
        // after all attempts the transaction is marked as failed
        transaction.set("status", paymentStatusSchema.enum.Failed);
      }
    }
    // update transaction status
    await transaction.save();
    logger.info(
      `Transaction ID: ${transaction?.id} Status: ${transaction?.status}`,
    );
  } catch (error) {

    logger.error(`Error while making stk query request:${error.message}`);
    throw new Error(error)
  }
};

export const handlePaymentConfirmation = async (
  payment: PaymentConfirmation,
) => {
  try {
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
    const job = await enqueueSTKPoll({
      transactionId: transaction.id,
      shortCode: link.shortCode,
      checkoutRequestId: transaction.checkout_request_id,
      attempts: 0,
    });

    logger.info(
      `Enqueued STK poll job ID: ${job.id} for transaction ${transaction.id}`,
    );
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

export const handleLinkExpiry = async (linkData: LinkExpiry) => {
  try {
    const link = await Link.findByPk(linkData.linkId);
  if (!link) {
    logger.error(`Link with ID: ${linkData.linkId} does not exists`);
    return;
  }

  link.set("status", linkStatusSchema.enum.Expired);
  await link.save();

  logger.info(`Link with ID: ${link.id} updated to status: ${link.status}`);
  }catch(error) {
    logger.error(`Error while expiring link with ID: ${linkData.linkId} error: ${error.message}`)

  }
};
