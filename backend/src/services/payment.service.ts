import { FRONTEND_BASE_URI, MPESA_EXPRESS_CALLBACK_URL, MPESA_EXPRESS_SANDBOX_CALLBACK_URL, NODE_ENV } from "../config/env"
import { mpesaClient } from "../config/mpesa/mpesaclient"
import {Buffer} from "buffer"
import { getTimeStamp } from "../utils/index"
import { PaymentLink } from "../middlewares/validators"
import { Link, User } from "../models/index"
import  base62  from "@sindresorhus/base62"

export const mpesaSTKPush = async(id: string, phoneNumber: string) => {
  // get id of the generated url use it to query required payment info
  const link = await Link.findByPk(id)
if(!link) return {link}
    const shortCode = link.id
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
      Amount: link.amount, // amount to be paid by customer
      PartyA: phoneNumber, // customers phone number
      PartyB: link.shortCode,
      PhoneNumber: phoneNumber, // to receive ussd prompt
      CallbackUrl:
        NODE_ENV === "production"
          ? MPESA_EXPRESS_CALLBACK_URL
          : MPESA_EXPRESS_SANDBOX_CALLBACK_URL,
      AccountReference: "",// Invoice Number
      TransactionDesc: "Make onlibe payment"
    };

    await mpesaClient.request("POST", "/stkpush/v1/processrequest", JSON.stringify(payload));
    return {link}
} 

export const validateMpesaPayment = async() => {
    
}

export const confirmMpesaPayment = async() => {
    
}


export const generatePaymentLink = async(linkData: PaymentLink) => {
  const merchant = await User.findOne({where: {clerk_id: linkData.merchant_id}})

  if(!merchant) return {merchant, link: null}
    const link = await Link.create({
      invoice_no: linkData.invoiceNo || "",
      merchant_id: merchant.id,
      url: "",
      expiresAt: linkData.expiresAt,
    });

    const base62String = base62.encodeString(link.id)
    const baseUrl = FRONTEND_BASE_URI
    const url = `${baseUrl}payments/payment-link?token=${base62String}`
    link.set("url", `${url}`)


    await link.save()
    return {merchant, link}

}