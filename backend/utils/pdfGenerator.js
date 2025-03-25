const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const QRCode = require("qrcode");
const fs = require("fs").promises;

const THEME_COLOR = "#0D9488";

// Register Handlebars helpers
handlebars.registerHelper("formatDate", (date) =>
  new Date(date).toLocaleDateString()
);
handlebars.registerHelper("formatTime", (date) =>
  new Date(date).toLocaleTimeString()
);

async function compileTemplate(templateName, data) {
  const html = await fs.readFile(`./templates/${templateName}.hbs`, "utf-8");
  return handlebars.compile(html, {
    noEscape: true,
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  })(data);
}

async function generatePDF(html) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
  });

  await browser.close();
  return pdf;
}

// Invoice Template
const generateInvoicePDF = async (payment, user, event) => {
  const plainPayment = payment.toObject();
  const plainUser = user.toObject();
  const plainEvent = event.toObject();

  const templateData = {
    THEME_COLOR,
    company: "PlanItNow",
    payment: plainPayment,
    user: plainUser,
    event: plainEvent,
    date: payment.createdAt.toLocaleDateString(),
  };

  const html = await compileTemplate("invoice", templateData);
  return generatePDF(html);
};

// Ticket Template
const generateEventTicketPDF = async (payment, user, event) => {
  const plainPayment = payment.toObject();
  const plainUser = user.toObject();
  const plainEvent = event.toObject();
  const qrData = JSON.stringify({
    userId: user._id,
    eventId: event._id,
    paymentId: payment.paymentId,
  });

  const qrCode = await QRCode.toDataURL(qrData);

  const templateData = {
    THEME_COLOR,
    company: "PlanItNow",
    payment: plainPayment,
    user: plainUser,
    event: plainEvent,
    qrCode,
  };

  const html = await compileTemplate("ticket", templateData);
  return generatePDF(html);
};

module.exports = { generateInvoicePDF, generateEventTicketPDF };
