import { Link, LinkStatus, Payment, PaymentStatus } from "src/models";
import { Id } from "src/schemas/validators";

export const generateAnalytics = async(id: Id) => {
    // total amount collected
    const totalCollected = (await Payment.sum("amount", {where: {status: PaymentStatus.Successful}})) || 0;
    // total active links
    const activeLinke = (await Link.count({where: {status: LinkStatus.ACTIVE}}))
    // total paid links
    const paidLinke = (await Link.count({where: {status: LinkStatus.PAID}}))
    // total pending payments
    const pendingPayments = await Payment.count({where: {status: PaymentStatus.Pending}})

    return {totalCollected, activeLinke, paidLinke, pendingPayments}


}