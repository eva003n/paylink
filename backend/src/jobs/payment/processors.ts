import {
  NODE_ENV,
  MPESA_EXPRESS_PASSKEY,
  MPESA_EXPRESS_SANDBOX_PASSKEY,
  MPESA_EXPRESS_CALLBACK_URL,
  MPESA_EXPRESS_SANDBOX_CALLBACK_URL,
  MPESA_SANDBOX_SHORTCODE,
  MPESA_SANDBOX_PARTYA,
} from "../../config/env";
import { mpesaClient } from "../../config/mpesa/mpesaclient";
import { getTimeStamp } from "../../utils";
import { PaymentData, PaymentQuery } from "./payment.type";
import logger from "../../logger/logger.winston";
import {PaymentSTKQueryResponse, PaymentSTKResponse } from "../../api/middlewares/validators";
import { Payment, PaymentStatus } from "../../models";
import { enqueueSTKPoll } from "../../queues";
import { MAX_POLL_ATTEMPTS } from "../../constants";

export const handleMpesaSTKPush = async (paymentData: PaymentData) => {
  const shortCode =
    NODE_ENV === "production" ? paymentData.shortCode : MPESA_SANDBOX_SHORTCODE;
  const passkey =
    NODE_ENV === "production"
      ? MPESA_EXPRESS_PASSKEY
      : MPESA_EXPRESS_SANDBOX_PASSKEY;
  const timeStamp = getTimeStamp();

  //create a transaction before hand the used the transactions id as the account reference

  // Shortcode+Passkey+Timestamp
  const base64String = Buffer.from(`${shortCode}:${passkey}:${timeStamp}`);

  let payload = {
    BusinessShortCode: shortCode, // mearchants's shortcode
    Password: base64String,
    Timestamp: timeStamp,
    TransactionType: "CustomerBuyGoodsOnline",
    Amount: Math.round(paymentData.amount), // amount to be paid by customer
    PartyA:
      NODE_ENV === "production"
        ? paymentData.phoneNumber
        : MPESA_SANDBOX_PARTYA, // customers phone number
    PartyB: shortCode,
    PhoneNumber: paymentData.phoneNumber, // to receive ussd prompt
    CallbackUrl:
      NODE_ENV === "production"
        ? MPESA_EXPRESS_CALLBACK_URL
        : MPESA_EXPRESS_SANDBOX_CALLBACK_URL,
    AccountReference: paymentData.transactionId,
    TransactionDesc: "Make online payment",
  };

  try {
    const response = await mpesaClient.request<PaymentSTKResponse, any>(
      "POST",
      "/stkpush/v1/processrequest",
      JSON.stringify(payload),
    );
    if (response.data.ResponseCode == 0) {
      logger.info(`STP push to PhoneNumber:${paymentData.phoneNumber} successfull`);

      // if request suecessfull add  checkoutrequestid and add to queue for STK query
      const transaction = await Payment.findByPk(paymentData.transactionId);
      transaction?.set("checkout_request_id", response.data.CheckoutRequestID);
      await transaction?.save();

    await enqueueSTKPoll({
        transactionId: paymentData.transactionId,
        shortCode: paymentData.shortCode,
        checkoutRequestId: transaction?.checkout_request_id as string,
        attempts: 0
      });

      logger.info(
        `Payment checkout query enqueued: CheckoutRequestID: ${response.data.CheckoutRequestID}`,
      );
    }else {
      logger.error(`STP push to PhoneNumber:${paymentData.phoneNumber} failed`)
    } 

  } catch (error) {
    logger.error(
      `Error:${error.message}, Mpesa Stk push to PhoneNumber: ${paymentData.phoneNumber}`,
    );
  }
};

export const handleMpesaSTKPoll = async (paymentQuery: PaymentQuery) => {
  const shortCode =
    (NODE_ENV === "production" ? paymentQuery.shortCode : parseInt(MPESA_SANDBOX_SHORTCODE as string)) as number;
  const passkey =
    (NODE_ENV === "production"
      ? MPESA_EXPRESS_PASSKEY
      : MPESA_EXPRESS_SANDBOX_PASSKEY) as string;
  const timeStamp = getTimeStamp();

  const base64String = Buffer.from(
    `${shortCode}:${passkey}:${timeStamp}`,
  ).toString("base64");
  const payload = JSON.stringify({
    BusinessShortCode: shortCode,
    Password: base64String,
    Timestamp: timeStamp,
    CheckoutRequestID: paymentQuery.checkoutRequestId,
  })

  try {
  const response = await mpesaClient.request<PaymentSTKQueryResponse, string>("POST", "/stkpushquery/v1/query", payload);
  const transaction = await Payment.findByPk(paymentQuery.transactionId)
const code = response.data.ResultCode
  if(code == 0) {
    transaction?.set("status", PaymentStatus.Successful)

    // generate payment receipt pdf

    // send receipt via email
  }
  
  // if user hasn't acted re-queue based on the maximum pools
  if (code > 0) {
    logger.info(
      `Payment query with CheckoutID: ${paymentQuery.checkoutRequestId} requeued for STK quering`,
    );

    // inly queue when the max poll attempts is not reached
    if (paymentQuery.attempts >= MAX_POLL_ATTEMPTS) {
      paymentQuery.attempts++;
      // re-queue
      await enqueueSTKPoll(paymentQuery);
    }

    // after all attempts the transaction is marked as failed
    transaction?.set("status", PaymentStatus.Failed);
  }
// update transaction status
  await transaction?.save()
    logger.info(
      `Transaction ID: ${transaction?.id} Status: ${transaction?.status}`,
    );

  } catch (error) {
    logger.error(`Error while making stk query request:${error.message}`)
    
  }
};
export const handlePaymentConfirmation = async () => {};
