import { Client, Link,  Merchant, Payment, PaymentStatus } from "src/models";
import { Id } from "src/schemas/validators";
import { linkStatusSchema } from "@shared/schemas/validators";

export const generateAnalytics = async(id: Id) => {
    // total amount collected
    const totalCollectedPay = (await Payment.sum("amount", {where: {status: PaymentStatus.Successful}})) || 0;
    // completed payments
    const totalCompletedPay = (await Payment.count({where: {status: PaymentStatus.Successful}}) ) || 0
    // total active links
    const activeLinks = await Link.count({
      where: { status: linkStatusSchema.enum.Active },
    });

    const totalLinks = (await Link.count()) || 0;
    // total paid links
    const paidLinks = await Link.count({
      where: { status: linkStatusSchema.enum.Paid},
    });
    // total pending payments
    const pendingPayments = await Payment.count({where: {status: PaymentStatus.Pending}})
    const failedPayments = await Payment.count({where: {status: PaymentStatus.Failed}})
    const recentTransactions = await Payment.findAll({
      where: { merchant_id: id },
      include: [
        {
          model: Merchant,
        //   as: "merchant",
          required: false,
        },
        {
            model: Client,
            // as: "client",
            required: false
        }
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
      failedPayments
    };

    return {stats, recentTransactions }
}