export  const QUEUE_NAMES = {
    PAYMENT: "paylink_payment",
    EMAIL: "paylink_email",
    PDF: "paylink_pdf",
    LINK: "paylink_link"
} 

export const WORKER_NAMES = {
    PAYMENT: "payment_worker",
    EMAIL: "email_worker",
    PDF: "pdf_worker",
    LINK: "link_worker",
}

export const JOB_NAMES = {
    STK_PUSH: "stk.push",
    STK_POLL: "stk.poll",
    CONFIRM_PAYMENT: "stk.payment",
    LINK_EXPIRED: "link.expired",
    PDF_RECEIPT: "pdf.receipt",
    RECEIPT_EMAIL: "email.receipt"
}

export const MPESA_TOKEN_DATA = {
    TOKEN: "mpesa_token",
    EXPIRY: "mpesa_expiry"
}
export const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const MAX_POLL_ATTEMPTS = 4;