import { NODE_ENV, MPESA_EXPRESS_PASSKEY, MPESA_EXPRESS_SANDBOX_PASSKEY, MPESA_EXPRESS_CALLBACK_URL, MPESA_EXPRESS_SANDBOX_CALLBACK_URL } from "../../config/env";
import { mpesaClient } from "../../config/mpesa/mpesaclient";
import { getTimeStamp } from "../../utils";
import { PaymentData } from "./payment.type";
import logger from "../../logger/logger.winston";

export const handleMpesaSTKPush = async (paymentData: PaymentData) => {

  const shortCode = paymentData.shortCode;
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
    Amount: Math.floor(paymentData.amount), // amount to be paid by customer
    PartyA: paymentData.phoneNumber, // customers phone number
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
      await mpesaClient.request(
        "POST",
        "/stkpush/v1/processrequest",
        JSON.stringify(payload),
      );
    
  } catch (error) {
    logger.error(`Error:${error.message}, Mpesa Stk push to PhoneNumber: ${paymentData.phoneNumber}`)
  }

};

export const handlePaymentConfirmation = async() => {
  
}