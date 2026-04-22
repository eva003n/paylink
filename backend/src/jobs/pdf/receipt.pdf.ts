import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { getAbsolutePath } from "../../api/utils";
import { ReceiptContent } from "../../schemas/validators";
import  logger  from "../../api/logger/logger.winston";

const fmtKES = (n: number) =>
  `KES ${Number(n).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDateTime = (d: Date | string) =>
  d
    ? new Date(d).toLocaleString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

const fmtPhone = (p: string) => {
  if (!p) return "—";
  const s = String(p);
  if (s.startsWith("254") && s.length === 12)
    return `+254 ${s.slice(3, 6)} ${s.slice(6, 9).replace(s.slice(6, 9), "XXX")} ${s.slice(9)}`;
  return s;
};


const COLORS = {
  headerBg:     "#0D2B1A",
  accent:       "#00A651",
  accentDark:   "#007A3D",
  amountBg:     "#F0FAF4",
  amountText:   "#005C2E",
  rowAlt:       "#F7FBF8",
  rowBorder:    "#E2EDE6",
  labelText:    "#5A6B60",
  valueText:    "#1A1A1A",
  successText:  "#007A3D",
  footerBorder: "#D8DDD9",
  footerText:   "#8A9690",
  white:        "#FFFFFF",
  badgeBg:      "#00A651",
};

const ML = 48;   // margin left
const MR = 48;   // margin right
const MT = 44;   // margin top

export const generatePDFReceipt = (data: ReceiptContent) => {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 0, left: 0, right: 0, bottom: 0 },
    info: {
      Title: "M-Pesa Payment Receipt",
      Author: "Paylink",
      Subject: "Payment confirmation",
      CreationDate: new Date(Date.now()),
    },
  });

  const OUT = getAbsolutePath("../../../public/doc/receipt.pdf", __dirname);
  doc.pipe(createWriteStream(OUT));

  const PW = doc.page.width;
  const PH = doc.page.height;
  const CW = PW - ML - MR; // content width

  const HEADER_H = 96;
  doc.rect(0, 0, PW, HEADER_H).fill(COLORS.headerBg);

  // Accent bar at bottom of header
  doc.rect(0, HEADER_H - 4, PW, 4).fill(COLORS.accent);

  // Brand name
  doc
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("PAYLINK", ML, MT);

  // Tagline
  doc
    .fillColor("#7DBFA0")
    .font("Helvetica")
    .fontSize(10)
    .text("M-Pesa Payment Receipt", ML, MT + 28);

  // Powered by line
  doc
    .fillColor("#4E7A5E")
    .fontSize(8.5)
    .text("Powered by Safaricom Daraja API", ML, MT + 44);

  // PAID badge – pill shape
  const BADGE_W = 64;
  const BADGE_H = 26;
  const BADGE_X = PW - MR - BADGE_W;
  const BADGE_Y = MT + 10;
  doc.roundedRect(BADGE_X, BADGE_Y, BADGE_W, BADGE_H, 13).fill(COLORS.accent);
  doc
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("PAID", BADGE_X, BADGE_Y + 7, { width: BADGE_W, align: "center" });

  const AMOUNT_Y = HEADER_H;
  const AMOUNT_H = 92;
  doc.rect(0, AMOUNT_Y, PW, AMOUNT_H).fill(COLORS.amountBg);

  // Subtle inner top border
  doc.rect(ML, AMOUNT_Y + 1, CW, 0.5).fill(COLORS.rowBorder);

  // Amount value
  doc
    .fillColor(COLORS.amountText)
    .font("Helvetica-Bold")
    .fontSize(36)
    .text(fmtKES(data.amount), ML, AMOUNT_Y + 16, { align: "center", width: CW });

  // Sub-label
  doc
    .fillColor("#5A8C6E")
    .font("Helvetica")
    .fontSize(10)
    .text("Amount Received — Transaction Confirmed", ML, AMOUNT_Y + 58, {
      align: "center",
      width: CW,
    });

  // Bottom border of amount band
  doc.rect(0, AMOUNT_Y + AMOUNT_H - 1, PW, 1).fill(COLORS.rowBorder);

  const TABLE_X = ML;
  const TABLE_W = CW;
  const ROW_H = 30;
  const TABLE_Y = AMOUNT_Y + AMOUNT_H + 16;
  const COL_SPLIT = TABLE_X + TABLE_W * 0.44; // label/value split

  const rows = [
    // ["Transaction ID",   data.reference],
    ["M-Pesa Receipt",   data.reference],
    ["Business",         data.businessName],
    ["Service",          "M-Pesa STK Push"],
    ["Client",           data.email],
    ["M-Pesa Number",    fmtPhone(data.phoneNumber)],
    // ["Checkout ID",      data.reference],
    ["Date",             fmtDateTime(data.date as string)],
    ["Payment Method",   "M-Pesa STK Push"],
    ["Status",           data.status.toUpperCase()],
  ];

  // Section title
  doc
    .fillColor(COLORS.labelText)
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .text("TRANSACTION DETAILS", TABLE_X, TABLE_Y - 12);

  // Outer card border
  const TABLE_FULL_H = rows.length * ROW_H;
  doc
    .roundedRect(TABLE_X, TABLE_Y, TABLE_W, TABLE_FULL_H, 6)
    .strokeColor(COLORS.rowBorder)
    .lineWidth(0.8)
    .stroke();

  rows.forEach(([label, val], i) => {
    const ry = TABLE_Y + i * ROW_H;

    // Alternating row fill
    if (i % 2 === 0) {
      if (i === 0) {
        // Clip top corners for first row
        doc.save();
        doc.roundedRect(TABLE_X, ry, TABLE_W, ROW_H, 6).clip();
        doc.rect(TABLE_X, ry, TABLE_W, ROW_H).fill(COLORS.rowAlt);
        doc.restore();
      } else {
        doc.rect(TABLE_X, ry, TABLE_W, ROW_H).fill(COLORS.rowAlt);
      }
    }

    // Row divider (skip top of table)
    if (i > 0) {
      doc
        .moveTo(TABLE_X + 8, ry)
        .lineTo(TABLE_X + TABLE_W - 8, ry)
        .strokeColor(COLORS.rowBorder)
        .lineWidth(0.4)
        .stroke();
    }

    // Vertical divider
    const DIV_X = COL_SPLIT;
    doc
      .moveTo(DIV_X, ry + 6)
      .lineTo(DIV_X, ry + ROW_H - 6)
      .strokeColor(COLORS.rowBorder)
      .lineWidth(0.4)
      .stroke();

    const textY = ry + ROW_H / 2 - 5; // vertically centered

    // Label
    doc
      .fillColor(COLORS.labelText)
      .font("Helvetica")
      .fontSize(9.5)
      .text(label as string, TABLE_X + 14, textY, { width: COL_SPLIT - TABLE_X - 20 });

    // Value
    const isStatus = val === "CONFIRMED ✓";
    doc
      .fillColor(isStatus ? COLORS.successText : COLORS.valueText)
      .font(isStatus ? "Helvetica-Bold" : "Helvetica")
      .fontSize(9.5)
      .text(String(val).slice(0, 56), COL_SPLIT + 10, textY, {
        width: TABLE_X + TABLE_W - COL_SPLIT - 20,
      });
  });

  const NOTE_Y = TABLE_Y + TABLE_FULL_H + 20;
  doc
    .roundedRect(TABLE_X, NOTE_Y, TABLE_W, 36, 5)
    .fill(COLORS.amountBg)
    .strokeColor(COLORS.rowBorder)
    .lineWidth(0.6)
    .stroke();

  doc
    .fillColor(COLORS.amountText)
    .font("Helvetica-Bold")
    .fontSize(9);
  doc.text(
    "Verify this payment on M-Pesa: *334# > My Account > Statement",
    TABLE_X + 14,
    NOTE_Y + 13,
    { width: TABLE_W - 28 }
  );

  const FOOTER_Y = PH - 56;
  doc
    .moveTo(ML, FOOTER_Y)
    .lineTo(PW - MR, FOOTER_Y)
    .strokeColor(COLORS.footerBorder)
    .lineWidth(0.6)
    .stroke();

  doc
    .fillColor(COLORS.footerText)
    .font("Helvetica")
    .fontSize(8.5)
    .text(
      "This receipt was auto-generated by Paylink. Retain as proof of payment.",
      ML,
      FOOTER_Y + 14,
      { align: "center", width: CW }
    );

  doc
    .fillColor(COLORS.footerText)
    .fontSize(8)
    .text(
      `Paylink © ${new Date().getFullYear()}  ·  Built on Safaricom Daraja API  ·  ${fmtDateTime(data.date as string)}`,
      ML,
      FOOTER_Y + 30,
      { align: "center", width: CW }
    );

  doc.end();
logger.info(`✓ Receipt written to ${OUT}`);
};

// const receiptData = {
//   name:        "Jane Doe",
//   email:       "jane.doe@example.com",
//   businessName:"Paylink Ltd",
//   amount:      1250.50,
//   phoneNumber: "254712345678",
//   date:        "2026-04-20T14:30:00.000Z",
//   reference:   "PLNK-20260420-001",
//   paymentType: "M-Pesa STK Push",
//   account:     "123456",
//   paybill:     123456,
// };

// generatePDFReceipt(receiptData);
