import { Client, Link, Merchant, Payment } from "../models";
import { Id } from "../../schemas/validators";
import { linkStatusSchema } from "@paylink/shared";
import { paymentStatusSchema } from "@paylink/shared";
import { sequelize } from "../config/db/postgres";
import { paymentsDTO} from "../dto";


export const generateAnalytics = async (id: Id) => {
  // total amount collected
  const totalCollectedPay =
    (await Payment.sum("amount", {
      where: { status: paymentStatusSchema.enum.Completed },
    })) || 0;
  // completed payments
  const totalCompletedPay =
    (await Payment.count({
      where: { status: paymentStatusSchema.enum.Completed },
    })) || 0;
  // total active links
  const activeLinks = await Link.count({
    where: { status: linkStatusSchema.enum.Active },
  });

  const totalLinks = (await Link.count()) || 0;
  // total paid links
  const paidLinks = await Link.count({
    where: { status: linkStatusSchema.enum.Paid },
  });
  const expiredLinks = await Link.count({
    where: { status: linkStatusSchema.enum.Expired},
  });
  const cancelledLinks = await Link.count({
    where: { status: linkStatusSchema.enum.Cancelled },
  });
  // total pending payments
  const pendingPayments = await Payment.count({
    where: { status: paymentStatusSchema.enum.Pending },
  });
  const failedPayments = await Payment.count({
    where: { status: paymentStatusSchema.enum.Failed },
  });
  const recentTransactions = await Payment.findAll({
    where: { merchant_id: id },
    attributes: [
      "id",
      "status",
      "amount",
      [sequelize.col("mpesa_ref"), "mpesaRef"],
      [sequelize.col("Merchant.business_name"), "businessName"],
      [sequelize.col("Merchant.business_name"), "businessName"],
      [sequelize.col("Client.phone_number"), "phoneNumber"],
      [sequelize.col("Client.email"), "clientName"],
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Merchant,
        as: "Merchant",
        attributes: [],
        required: true,
      },
      {
        model: Client,
        as: "Client",
        attributes: [],
        required: true,
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  
  const stats = {
    totalCollectedPay,
    totalCompletedPay,
    activeLinks,
    totalLinks,
    paidLinks,
    pendingPayments,
    failedPayments,
  };

  const links = {
    active: activeLinks,
    paid: paidLinks,
    expired: expiredLinks,
    cancelled: cancelledLinks,
    total: totalLinks,
  }
  // in sequelize dataValues prop contains the actual data(excluding sequelize internals)
  return { stats, recentTransactions: recentTransactions.map((tx) => paymentsDTO.create(tx.dataValues)), links };
};
