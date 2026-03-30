import base62 from "@sindresorhus/base62";
import { FRONTEND_BASE_URI } from "../../config/env";
import { Merchant, Link } from "../../models";
import { PaymentLink } from "../../validators/validators";

export const generatePaymentLink = async (linkData: PaymentLink) => {
  const merchant = await Merchant.findByPk(linkData.merchant_id);

  if (!merchant) return { merchant, link: null };
  const link = await Link.create({
    invoice_no: linkData.invoiceNo || "",
    shortCode: linkData.shortCode,
    amount: linkData.amount,
    merchant_id: merchant.id,
    url: "",
    expiresAt: linkData.expiresAt,
  });

  const base62String = base62.encodeString(link.id);
  const baseUrl = FRONTEND_BASE_URI;
  const url = `${baseUrl}/payments/payment-link?token=${base62String}`;
  link.set("url", `${url}`);
  link.set("token", `${base62String}`);

  await link.save();
  return { merchant, link };
};
