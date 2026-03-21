import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { getAbsolutePath } from "../../utils";
import { MONTHS_FULL } from "../../constants";
import { ReceiptContent } from "./receipt.type";


function getSuperScript(date: number) {
  const secondDigit = date.toString().split("")[1];
  let superScript;
  if (secondDigit === "1") {
    superScript = "st";
  } else if (secondDigit === "2") {
    superScript = "nd";
  } else if (secondDigit === "3") {
    superScript = "rd";
  } else {
    superScript = "th";
  }

  return superScript;
}
function generateDate() {
  let currentDate = new Date(Date.now());
  const superScript = getSuperScript(currentDate.getDate());

  const dateString = `${currentDate.getDate()}${superScript} ${MONTHS_FULL[currentDate.getMonth()]} ${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()} ${currentDate.getHours() > 11 ? "PM" : "AM"}`;

  return dateString;
}
export const generatePDFReceipt = (data: ReceiptContent) => {
  const receiptDocument = new PDFDocument({
    info: {
      Title: "Mpesa payment receipt",
      Author: "Paylink",
      Subject: "Payment confirmation",
      CreationDate: new Date(Date.now()),
      ModDate: new Date(Date.now()),
    },
  });

  // create a writable stream in order to write to file
  receiptDocument.pipe(
    createWriteStream(
      getAbsolutePath("../../../public/doc/receipt.pdf", __dirname),
    ),
  );
  // content
  receiptDocument
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor("#00A651")
    .text("Paylink", { align: "center" });

  receiptDocument.moveDown();

  receiptDocument
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(`Hi ${data.name},`, { align: "center" });

  receiptDocument.moveDown(2);

  receiptDocument
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("Payment Receipt", { align: "center" });

  receiptDocument.moveDown(1);

  // helper function
  function addRow(label: string, value: string) {
    const y = receiptDocument.y;
    receiptDocument
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(label, 50, y, { continued: true })
      .font("Helvetica")
      .fillColor("black")
      .text(value, 100, y);

    receiptDocument.moveDown();
  }
  // main content
  addRow("Total Amount Paid: ", `KES ${data.amount}`);
  addRow("Phone Number: ", data.phoneNumber);
  addRow("Date: ", data.date || generateDate());
  addRow("Paid To: ", data.businessName || "Paylink");
  addRow("Transaction No: ", data.reference);
  addRow("Payment Type: ", data.paymentType);
  addRow("Paybill Number: ", data.paybill.toString());
  addRow("Account No: ", data.account);

  // footer
  receiptDocument
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("gray")
    .text("Thank you for using Paylink", { align: "center" });

  receiptDocument.end();
};

