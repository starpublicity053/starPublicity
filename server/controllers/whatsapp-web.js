// whatsapp-web.js
const { Client } = require("whatsapp-web.js");
const { MongoAuthStrategy } = require('wwebjs-mongo'); // <-- Import MongoAuthStrategy
const mongoose = require('mongoose'); // <-- Import mongoose
const qrcode = require("qrcode-terminal");
const dotenv = require("dotenv");

dotenv.config();

let isClientReady = false;
let client = null;

const initializeWhatsAppClient = async () => {
  console.log("Attempting to initialize WhatsApp client...");

  // Ensure you have a mongoose connection before initializing
  if (mongoose.connection.readyState !== 1) {
    console.log("MongoDB not connected, waiting for connection...");
    // In a real app, you'd handle this more robustly, but for now,
    // we assume connectDB() is called in your main app.js before this.
    // If it still fails, you might need to pass the mongoose connection here.
    return;
  }

  isClientReady = false;

  if (client) {
    try {
      await client.destroy();
      console.log("Existing client destroyed successfully.");
    } catch (destroyErr) {
      console.error("Error destroying existing client:", destroyErr.message);
    }
  }

  client = new Client({
    // CORRECTED: Use MongoAuthStrategy instead of LocalAuth
    authStrategy: new MongoAuthStrategy({ mongoose: mongoose }),
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    },
    qrTimeout: 90000,
    qrMaxRetries: 5,
  });

  client.on("qr", (qr) => {
    console.log("📲 Scan this QR code to log in:");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    isClientReady = true;
    console.log("✅ WhatsApp client is ready!");
  });

  client.on("authenticated", () => {
    console.log("🔐 WhatsApp client authenticated.");
  });

  client.on("auth_failure", (msg) => {
    console.error("❌ WhatsApp authentication failed:", msg);
  });

  client.on("disconnected", (reason) => {
    isClientReady = false;
    console.warn(`⚠️ WhatsApp client disconnected: ${reason}`);
    client.destroy();
    client = null;
    setTimeout(initializeWhatsAppClient, 5000);
  });

  try {
    await client.initialize();
  } catch (err) {
    console.error("❌ WhatsApp client initialization failed:", err.message);
    setTimeout(initializeWhatsAppClient, 10000);
  }
};

// The rest of your file (sendWhatsAppMessage, etc.) remains the same.
// ... (keep all your other functions as they are)

// Make sure you call this initialization from your main app.js AFTER connectDB() is successful.
// For example:
// connectDB().then(() => {
//   initializeWhatsAppClient();
//   app.listen(...);
// });

const getWhatsAppId = (phoneNumber) => {
  if (!phoneNumber) return null;
  const cleanNumber = String(phoneNumber).replace(/\D/g, "");

  if (cleanNumber.length === 10) {
    return `91${cleanNumber}@c.us`;
  } else if (cleanNumber.length === 12 && cleanNumber.startsWith("91")) {
    return `${cleanNumber}@c.us`;
  }

  console.warn(`⚠️ Invalid phone number for WhatsApp: ${phoneNumber}`);
  return null;
};

const sendWhatsAppMessage = async (recipientPhoneNumber, messageContent) => {
  const maxWaitTime = 30000;
  const checkInterval = 1000;
  let waitedTime = 0;

  while (!isClientReady && waitedTime < maxWaitTime) {
    console.log(`⏳ Waiting for WhatsApp client... (${waitedTime / 1000}s)`);
    await new Promise((resolve) => setTimeout(resolve, checkInterval));
    waitedTime += checkInterval;
  }

  if (!isClientReady) {
    throw new Error("WhatsApp client not ready after timeout.");
  }

  const recipientId = getWhatsAppId(recipientPhoneNumber);

  if (!recipientId) {
    throw new Error(`Invalid phone number: ${recipientPhoneNumber}`);
  }

  try {
    await client.sendMessage(recipientId, messageContent);
    console.log(`✅ Message sent to ${recipientId}`);
    return { success: true, message: "WhatsApp message sent." };
  } catch (error) {
    console.error(
      `❌ Failed to send WhatsApp message to ${recipientPhoneNumber}:`,
      error.message
    );
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
};

// Existing function for Unipole inquiries
const sendAtlInquiryWhatsApp = async (formData) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
  } = formData;

  const whatsappMessage = `
🆕 *New ATL Inquiry*

An inquiry has been received from the ATL page.

👤 *Name:* ${firstName} ${lastName}
📞 *Phone:* ${phoneNumber}
✉️ *Email:* ${email}

Please follow up with them at your earliest convenience.

*Received:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
`.trim();

  return sendWhatsAppMessage(
    process.env.INQUIRY_RECEIVER_PHONE,
    whatsappMessage
  );
};
const sendBtlInquiryWhatsApp = async (formData) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
  } = formData;

  const whatsappMessage = `
🆕 *New BTL Inquiry*

An inquiry has been received from the BTL page.

👤 *Name:* ${firstName} ${lastName}
📞 *Phone:* ${phoneNumber}
✉️ *Email:* ${email}

Please follow up with them at your earliest convenience.

*Received:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
`.trim();

  return sendWhatsAppMessage(
    process.env.INQUIRY_RECEIVER_PHONE,
    whatsappMessage
  );
};

const sendTtlInquiryWhatsApp = async (formData) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
  } = formData;

  const whatsappMessage = `
🆕 *New TTL Page Inquiry*

An inquiry has been received from the modal form.

👤 *Name:* ${firstName} ${lastName}
📞 *Phone:* ${phoneNumber}
✉️ *Email:* ${email}

Please follow up with them at your earliest convenience.

*Received:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
`.trim();

  // This assumes you have a generic function `sendWhatsAppMessage` to send the payload.
  return sendWhatsAppMessage(
    process.env.INQUIRY_RECEIVER_PHONE,
    whatsappMessage
  );
};


// NEW function for general contact inquiries
const sendContactInquiryWhatsApp = async (formData) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    city,
    advertisingState,
    advertisingMarket,
    topic,
    media,
    message,
  } = formData;

  const whatsappMessage = `
📝 *New Contact Inquiry*

👤 *Name:* ${firstName} ${lastName}
📞 *Phone:* ${phone || "N/A"}
✉️ *Email:* ${email || "N/A"}
📍 *City:* ${city || "N/A"}
📊 *Ad State:* ${advertisingState || "N/A"}
🏙️ *Ad Market:* ${advertisingMarket || "N/A"}
💡 *Topic:* ${topic || "N/A"}
📺 *Media:* ${media || "N/A"}

💬 *Message:*
${message || "(No message)"}

🕐 *Received:* ${new Date().toLocaleString()}

🔗 _Sent via the Contact Us Form on your website_
  `.trim();

  return sendWhatsAppMessage(
    process.env.INQUIRY_RECEIVER_PHONE, // Send to the admin WhatsApp
    whatsappMessage
  );
};

const sendUserConfirmationWhatsApp = async (formData) => {
  const { firstName, phone, phoneNumber } = formData; // Ensure 'phone' or 'phoneNumber' is correctly destructured

  const confirmationMessage = `
👋 *Hello ${firstName},*

Thank you for contacting *Star Publicity*! We’ve received your inquiry and will get back to you shortly.

If you have urgent questions, feel free to reach out via our website or call (91+8839728739).

📍 _Star Publicity Team_

🔔 _This is an automated message_
  `.trim();

  return sendWhatsAppMessage(phone || phoneNumber, confirmationMessage); // Use 'phone' or 'phoneNumber'
};

const sendBlogContactInquiryWhatsApp = async (formData) => { 
  const {
    name,
    email,
    company,
    phone,
    serviceOfInterest,
    message,
    submittedAt,
  } = formData;

  const whatsappMessage = `
📝 *New Blog Contact Inquiry*

👤 *Name:* ${name}
✉️ *Email:* ${email}
🏢 *Company:* ${company || "N/A"}
📞 *Phone:* ${phone || "N/A"}
🎯 *Service of Interest:* ${serviceOfInterest || "N/A"}

💬 *Message:*
${message || "(No message)"}

🕐 *Received:* ${submittedAt ? new Date(submittedAt).toLocaleString() : new Date().toLocaleString()}

🔗 _Sent via the Blog Contact Form on your website_
  `.trim();

  return sendWhatsAppMessage(
    process.env.INQUIRY_RECEIVER_PHONE,
    whatsappMessage
  );
};

module.exports = {
  initializeWhatsAppClient, // Export the initialization function
  client,
  sendWhatsAppMessage,
  sendAtlInquiryWhatsApp,
  sendTtlInquiryWhatsApp,
  sendBtlInquiryWhatsApp,
  sendUserConfirmationWhatsApp,
  sendContactInquiryWhatsApp,
  sendBlogContactInquiryWhatsApp,
};