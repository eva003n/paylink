export  const QUEUE_NAMES = {
    PAYMENT: "paylink_payment",
    EMAIL: "paylink_email",
    PDF: "paylink_pdf"
} 

export const JOB_NAMES = {
    STKPUSH: "stk.push",
    STKPOLL: "stk.poll",
    CONFIRMPAYMENT: "stk.payment",
    PAYMENTEXPIRED: "payment.expired" 
}

export const MAX_POLL_ATTEMPTS = 12;