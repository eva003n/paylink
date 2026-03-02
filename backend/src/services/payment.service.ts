import { MPESA_EXPRESS_CALLBACK_URL, MPESA_EXPRESS_SANDBOX_CALLBACK_URL, NODE_ENV } from "../config/env"
import { mpesaClient } from "../config/mpesa/mpesaclient"
import {Buffer} from "buffer"
import { getTimeStamp } from "../utils/index"


export const mpesaSTKPush = async() => {
  // get id of the generated url use it to query required payment info
    const shortCode = "" 
    const passkey = "" 
    const timeStamp = getTimeStamp()

    //create a transaction before hand the used the transactions id as the account reference

    // Shortcode+Passkey+Timestamp
    const base64String = Buffer.from(`${shortCode}:${passkey}:${timeStamp}`)

    let payload = {
      BusinessShortCode: shortCode, // mearchants's shortcode
      Password: base64String,
      Timestamp: timeStamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: "", // amount to be paid by customer
      PartyA: "", // customers phone number
      PartyB: shortCode,
      PhoneNumber: "", // to receive ussd prompt
      CallbackUrl:
        NODE_ENV === "production"
          ? MPESA_EXPRESS_CALLBACK_URL
          : MPESA_EXPRESS_SANDBOX_CALLBACK_URL,
      AccountReference: "",// Invoice Number
      TransactionDesc: "Make onlibe payment"
    };

    await mpesaClient.request("POST", "/stkpush/v1/processrequest", JSON.stringify(payload));
} 

export const validateMpesaPayment = async() => {
    
}

export const confirmMpesaPayment = async() => {
    
}


export const generatePaymentLink = async() => {

}