const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (
  to,
  subject,
  text,
  html,
  invoicePDF = null,
  ticketPDF = null,
  transactionId = null
) => {
  try {
    const attachments = [];
    
    
    if (invoicePDF && transactionId) {
      attachments.push({
        filename: `Invoice-${transactionId}.pdf`,
        content: invoicePDF,
        contentType: "application/pdf",
      });
    }

    
    if (ticketPDF && transactionId) {
      attachments.push({
        filename: `Ticket-${transactionId}.pdf`,
        content: ticketPDF,
        contentType: "application/pdf",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

const sendPaymentConfirmationEmail = async (
  to,
  user,
  event,
  amount,
  transactionId,
  invoicePDF,
  ticketPDF
) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates/paymentConfirmation.ejs"
    );
    const html = await ejs.renderFile(templatePath, {
      user,
      event,
      amount,
      transactionId,
    });
    await sendMail(
      to,
      "Payment Confirmation",
      null,
      html,
      invoicePDF,
      ticketPDF,
      transactionId
    );
  } catch (error) {
    throw error;
  }
};

const sendPasswordResetEmail = async (to, user, resetUrl) => {
  try {
    const templatePath = path.join(__dirname, "../templates/passwordReset.ejs");
    const html = await ejs.renderFile(templatePath, { user, resetUrl });
    
    await sendMail(
      to,
      "Password Reset Instructions",
      `Please use this link to reset your password: ${resetUrl}`,
      html
    );
  } catch (error) {
    throw error;
  }
};

module.exports = { sendMail, sendPaymentConfirmationEmail, sendPasswordResetEmail};
