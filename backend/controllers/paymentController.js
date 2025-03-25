const phonepeConfig = require("../config/phonepe");
const axios = require("axios");

const {
  generateBase64Payload,
  generateChecksum,
  createPaymentPayload,
} = require("../utils/phonepe");

const Payment = require("../models/Payment");
const { sendPaymentConfirmationEmail } = require("../utils/nodemailer");
const Event = require("../models/Event");
const {
  generateInvoicePDF,
  generateEventTicketPDF,
} = require("../utils/pdfGenerator");

exports.handlePaymentInitiation = async (req, res) => {
  try {
    const amount = +req.query.amount;
    const eventId = req.query.eventId;
    const userId = req.user.id;
    console.log(eventId, userId, amount);

    const merchantTransactionId = `TXN_${Date.now()}`;

    const payment = new Payment({
      user: userId,
      event: eventId,
      paymentId: merchantTransactionId,
      amount: amount,
      status: "pending",
      currency: "INR",
      provider: "phonepe",
    });
    await payment.save();

    const payload = createPaymentPayload(amount, merchantTransactionId, userId);
    const base64Payload = generateBase64Payload(payload);
    const xVerify = generateChecksum(base64Payload, "/pg/v1/pay");

    const response = await axios.post(
      `${phonepeConfig.baseUrl}/pg/v1/pay`,
      { request: base64Payload },
      { headers: { "X-VERIFY": xVerify, "Content-Type": "application/json" } }
    );

    const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;

    await Payment.findOneAndUpdate(
      { paymentId: merchantTransactionId },
      { paymentLink: redirectUrl }
    );

    res.json({
      success: true,
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.handlePaymentValidation = async (req, res) => {
  try {
    const { merchantTransactionId } = req.params;
    const statusEndpoint = `/pg/v1/status/${phonepeConfig.merchantId}/${merchantTransactionId}`;
    const xVerify = generateChecksum("", statusEndpoint);

    const response = await axios.get(
      `${phonepeConfig.baseUrl}${statusEndpoint}`,
      {
        headers: {
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": phonepeConfig.merchantId,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentStatus =
      response.data.code === "PAYMENT_SUCCESS" ? "paid" : "failed";
    await Payment.findOneAndUpdate(
      { paymentId: merchantTransactionId },
      { status: paymentStatus }
    );
    const payment = await Payment.findOne({ paymentId: merchantTransactionId })
      .populate("user", "name email")
      .populate("event", "title date");

    if (paymentStatus === "paid" && payment.user && payment.user.email) {
      await Event.updateOne(
        { _id: payment.event._id },
        { $addToSet: { participants: payment.user._id } }
      );
    }
    const redirectUrl = `http://localhost:5173/payment-complete?transactionId=${merchantTransactionId}&status=${paymentStatus}`;
    res.redirect(redirectUrl);

    // ticket, invoice and email generation.
    if (paymentStatus === "paid") {
      processPostPaymentTasks(merchantTransactionId).catch(console.error);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

async function processPostPaymentTasks(merchantTransactionId) {
  try {
    const payment = await Payment.findOne({ paymentId: merchantTransactionId })
      .populate("user", "name email")
      .populate("event", "title date");

    const [invoicePDF, ticketPDF] = await Promise.all([
      generateInvoicePDF(payment, payment.user, payment.event),
      generateEventTicketPDF(payment, payment.user, payment.event),
    ]);

    await Event.updateOne(
      { _id: payment.event._id },
      { $addToSet: { participants: payment.user._id } }
    );

    await sendPaymentConfirmationEmail(
      payment.user.email,
      payment.user,
      payment.event,
      payment.amount,
      payment.paymentId,
      invoicePDF,
      ticketPDF
    );
  } catch (error) {
    console.error("Post-payment processing failed:", error);
  }
}

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("event", "title date");
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.id })
      .populate("user", "name email")
      .populate("event", "title date");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payment",
      error: error.message,
    });
  }
};

exports.getMyEventPayments = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id });

    const eventIds = events.map((event) => event._id);

    const payments = await Payment.find({ event: { $in: eventIds } })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("event", "title date");

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payments for your created events",
      error: error.message,
    });
  }
};
