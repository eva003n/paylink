export  const QUEUE_NAMES = {
    PAYMENT: "paylink_payment",
    EMAIL: "paylink_email",
    PDF: "paylink_pdf"
} 

export const JOB_NAMES = {
    STK_PUSH: "stk.push",
    STK_POLL: "stk.poll",
    CONFIRMPAYMENT: "stk.payment",
    PAYMENT_EXPIRED: "payment.expired",
    PDF_RECEIPT: "pdf.receipt"
}

export const MAX_POLL_ATTEMPTS = 12;