export const template = (username: string) => {
  return `
   <!-- Main Container -->
    <table
      width="600"
      cellpadding="0"
      cellspacing="0"
      style="background: #ffffff; border-radius: 8px; overflow: hidden"
    >
      <!-- Header -->
      <tr>
        <td style="background: #0a2540; padding: 20px; text-align: center">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px">Paylink</h1>
          <!-- Replace with actual logo URL -->
          <!-- <img src="https://yourdomain.com/logo.png" alt="Paylink Logo" height="40" /> -->
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td style="padding: 30px">
          <h2 style="margin-top: 0; color: #333">Payment Confirmed ✅</h2>
          <p style="color: #555; line-height: 1.6">Hi ${username},</p>
          <p style="color: #555; line-height: 1.6">
            Your payment has been successfully processed. Please find your
            receipt attached as a PDF below.
          </p>
          <p style="color: #555; line-height: 1.6">
            If you have any questions, feel free to reply to this email or
            contact our support team.
          </p>
          <p style="color: #555">
            Thank you for using <strong>Paylink</strong>.
          </p>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td
          style="
            background: #f4f6f8;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
          "
        >
          © 2026 Paylink. All rights reserved.<br />
          Nairobi, Kenya
        </td>
      </tr>
    </table>
`;
}