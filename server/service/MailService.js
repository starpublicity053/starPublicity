// service/MailService.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// --- Nodemailer Transporter Configuration ---
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.HR_EMAIL, // Using env variable for email
    pass: process.env.HR_EMAIL_PASSWORD, // Using env variable for app password
  },
  /**
   * --- FIX FOR 'SELF-SIGNED CERTIFICATE' ERROR ---
   * This is added to bypass certificate validation.
   * WARNING: This should only be used for development if you are behind a
   * corporate proxy or firewall. It disables a security feature.
   * Remove this in a production environment where the network is open.
   */
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Sends a notification email when a new inquiry is submitted from the website.
 * @param {object} formData - The data from the contact form.
 */
const sendContactInquiryEmail = async (formData) => {
  // Destructure fields from YOUR ContactUs.jsx form
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

  const mailOptions = {
    from: `"Your Website" <${process.env.HR_EMAIL}>`,
    to: process.env.HR_RECEIVER_EMAIL, // The email address where you want to receive inquiries
    subject: `New Advertising Inquiry: ${topic} from ${firstName} ${lastName}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>New Advertising Inquiry</title>
          <style>
              body { margin: 0; padding: 0; background-color: #f5f8fa; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
              .email-container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e0e6eb; }
              .header { background-color: #004d99; padding: 25px 20px; text-align: center; color: #ffffff; }
              .header h1 { margin: 0; font-size: 26px; font-weight: 700; }
              .content-section { padding: 30px 40px; }
              .content-section h2 { color: #004d99; font-size: 24px; margin-top: 0; margin-bottom: 25px; text-align: center; font-weight: 600;}
              .data-table { width: 100%; border-radius: 8px; overflow: hidden; margin-bottom: 20px; border-collapse: collapse; }
              .data-table td { padding: 12px 18px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 15px; }
              .data-table tr:last-child td { border-bottom: none; }
              .data-table td:first-child { font-weight: bold; color: #333; width: 40%; }
              .data-table a { color: #007bff; text-decoration: none; word-break: break-all; }
              .message-box { background-color: #f8faff; border: 1px solid #dbe9ff; border-radius: 10px; padding: 25px; margin-top: 25px; }
              .footer { background-color: #e9ecef; padding: 25px 20px; text-align: center; font-size: 13px; color: #777; }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header"><h1>New Website Inquiry</h1></div>
              <div class="content-section">
                  <h2>🚀 Inquiry Details</h2>
                  <table class="data-table" role="presentation">
                      <tr><td>Full Name:</td><td>${firstName} ${lastName}</td></tr>
                      <tr><td>Email Address:</td><td><a href="mailto:${email}">${email}</a></td></tr>
                      <tr><td>Phone Number:</td><td>${phone}</td></tr>
                      <tr><td>City:</td><td>${city}</td></tr>
                  </table>

                  <table class="data-table" role="presentation" style="margin-top:20px;">
                      <tr><td>Topic:</td><td>${topic}</td></tr>
                      <tr><td>Preferred Media:</td><td>${media}</td></tr>
                      <tr><td>Advertising State:</td><td>${advertisingState}</td></tr>
                      <tr><td>Advertising Market:</td><td>${advertisingMarket}</td></tr>
                  </table>

                  <div class="message-box"><p>${message}</p></div>
              </div>
              <div class="footer"><p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p></div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Inquiry email sent successfully.");
  } catch (error) {
    console.error("Error sending inquiry email:", error);
    throw new Error("Failed to send inquiry email.");
  }
};

/**
 * Sends a notification email for Unipole inquiries.
 * @param {object} formData - The data from the Unipole inquiry form.
 */
const sendAtlInquiryEmail = async (formData) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email
  } = formData;

  const mailOptions = {
    from: `"Art Of Reach" <${process.env.HR_EMAIL}>`,
    to: process.env.HR_RECEIVER_EMAIL,
    subject: "📬 New ATL Inquiry Received",
    html: `
      <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <div style="background-color: #1A2A80; color: white; padding: 25px;">
          <h2 style="margin: 0; font-size: 24px;">New ATL Inquiry 📢</h2>
        </div>
        <div style="padding: 25px 30px; background-color: #ffffff; line-height: 1.6;">
          <p style="font-size: 16px; color: #333;">You've received a new inquiry from the ATL page. Please find the lead's details below and follow up promptly.</p>
          
          <table style="width: 100%; font-size: 16px; border-collapse: collapse; margin-top: 20px;">
            <tbody>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #555;">👤 Name:</td>
                <td style="padding: 12px 0;">${firstName} ${lastName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #555;">📞 Phone:</td>
                <td style="padding: 12px 0;">${phoneNumber}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: bold; color: #555;">✉️ Email:</td>
                <td style="padding: 12px 0;">
                  <a href="mailto:${email}" style="color: #1A2A80; text-decoration: none; font-weight: bold;">${email}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="font-size: 12px; color: #888; text-align: center; padding: 20px; background-color: #f7f9fc;">
          This auto-generated email was sent on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendBtlInquiryEmail = async (formData) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email
  } = formData;

  const mailOptions = {
    from: `"Art Of Reach" <${process.env.HR_EMAIL}>`,
    to: process.env.HR_RECEIVER_EMAIL,
    subject: "📬 New BTL Inquiry Received",
    html: `
      <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <div style="background-color: #1A2A80; color: white; padding: 25px;">
          <h2 style="margin: 0; font-size: 24px;">New BTL Inquiry 📢</h2>
        </div>
        <div style="padding: 25px 30px; background-color: #ffffff; line-height: 1.6;">
          <p style="font-size: 16px; color: #333;">You've received a new inquiry from the BTL page. Please find the lead's details below and follow up promptly.</p>
          
          <table style="width: 100%; font-size: 16px; border-collapse: collapse; margin-top: 20px;">
            <tbody>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #555;">👤 Name:</td>
                <td style="padding: 12px 0;">${firstName} ${lastName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #555;">📞 Phone:</td>
                <td style="padding: 12px 0;">${phoneNumber}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: bold; color: #555;">✉️ Email:</td>
                <td style="padding: 12px 0;">
                  <a href="mailto:${email}" style="color: #1A2A80; text-decoration: none; font-weight: bold;">${email}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="font-size: 12px; color: #888; text-align: center; padding: 20px; background-color: #f7f9fc;">
          This auto-generated email was sent on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendTtlInquiryEmail = async (formData) => {
  const { firstName, lastName, phoneNumber, email } = formData;

  const mailOptions = {
    from: `"Art Of Reach" <${process.env.HR_EMAIL}>`,
    to: process.env.HR_RECEIVER_EMAIL, // The email address that receives inquiry notifications
    subject: "📬 New Inquiry from TTL Page",
    html: `
      <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <div style="background-color: #1A2A80; color: white; padding: 25px;">
          <h2 style="margin: 0; font-size: 24px;">New TTL Inquiry 📢</h2>
        </div>
        <div style="padding: 25px 30px; background-color: #ffffff; line-height: 1.6;">
          <p style="font-size: 16px; color: #333;">You've received a new inquiry from the TTL page modal. Please find the lead's details below and follow up promptly.</p>
          
          <table style="width: 100%; font-size: 16px; border-collapse: collapse; margin-top: 20px;">
            <tbody>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #555;">👤 Name:</td>
                <td style="padding: 12px 0;">${firstName} ${lastName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #555;">📞 Phone:</td>
                <td style="padding: 12px 0;">${phoneNumber}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: bold; color: #555;">✉️ Email:</td>
                <td style="padding: 12px 0;">
                  <a href="mailto:${email}" style="color: #1A2A80; text-decoration: none; font-weight: bold;">${email}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="font-size: 12px; color: #888; text-align: center; padding: 20px; background-color: #f7f9fc;">
          This auto-generated email was sent on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};



/**
 * Sends a notification email when a new blog contact inquiry is submitted from the website.
 * @param {object} formData - The data from the blog contact form.
 */
const sendBlogContactInquiryEmail = async (formData) => {
  const {
    name,
    email,
    company,
    phone,
    serviceOfInterest,
    message,
    submittedAt,
  } = formData;

  const mailOptions = {
    from: `"Star Publicity" <${process.env.HR_EMAIL}>`,
    to: process.env.HR_RECEIVER_EMAIL,
    subject: `New Blog Contact Inquiry from ${name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>New Blog Contact Inquiry</title>
          <style>
              body { margin: 0; padding: 0; background-color: #f5f8fa; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
              .email-container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e0e6eb; }
              .header { background-color: #004d99; padding: 25px 20px; text-align: center; color: #ffffff; }
              .header h1 { margin: 0; font-size: 26px; font-weight: 700; }
              .content-section { padding: 30px 40px; }
              .content-section h2 { color: #004d99; font-size: 24px; margin-top: 0; margin-bottom: 25px; text-align: center; font-weight: 600;}
              .data-table { width: 100%; border-radius: 8px; overflow: hidden; margin-bottom: 20px; border-collapse: collapse; }
              .data-table td { padding: 12px 18px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 15px; }
              .data-table tr:last-child td { border-bottom: none; }
              .data-table td:first-child { font-weight: bold; color: #333; width: 40%; }
              .data-table a { color: #007bff; text-decoration: none; word-break: break-all; }
              .message-box { background-color: #f8faff; border: 1px solid #dbe9ff; border-radius: 10px; padding: 25px; margin-top: 25px; }
              .footer { background-color: #e9ecef; padding: 25px 20px; text-align: center; font-size: 13px; color: #777; }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header"><h1>New Blog Contact Inquiry</h1></div>
              <div class="content-section">
                  <h2>📝 Inquiry Details</h2>
                  <table class="data-table" role="presentation">
                      <tr><td>Name:</td><td>${name}</td></tr>
                      <tr><td>Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
                      <tr><td>Company:</td><td>${company || "N/A"}</td></tr>
                      <tr><td>Phone:</td><td>${phone || "N/A"}</td></tr>
                      <tr><td>Service of Interest:</td><td>${serviceOfInterest || "N/A"}</td></tr>
                      <tr><td>Submitted At:</td><td>${submittedAt ? new Date(submittedAt).toLocaleString() : new Date().toLocaleString()}</td></tr>
                  </table>
                  <div class="message-box"><p>${message || "(No message)"}</p></div>
              </div>
              <div class="footer"><p>&copy; ${new Date().getFullYear()} Star Publicity. All rights reserved.</p></div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Blog contact inquiry email sent successfully.");
  } catch (error) {
    console.error("Error sending blog contact inquiry email:", error);
    throw new Error("Failed to send blog contact inquiry email.");
  }
};

/**
 * Forwards an existing inquiry to another email address from the admin panel.
 * @param {object} params - The function parameters.
 * @param {object} params.inquiryData - The inquiry data from the database.
 * @param {string} params.forwardingEmail - The email address to forward to.
 */
const sendForwardedInquiryEmail = async ({ inquiryData, forwardingEmail }) => {
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
    createdAt,
  } = inquiryData;

  const mailOptions = {
    from: `"Admin Panel" <${process.env.HR_EMAIL}>`,
    to: forwardingEmail, // Send to the email provided by the admin
    subject: `[Fwd] Advertising Inquiry: ${topic} from ${firstName} ${lastName}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Forwarded Advertising Inquiry</title>
          <style>
              body { margin: 0; padding: 0; background-color: #f5f8fa; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
              .email-container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e0e6eb; }
              .header { background-color: #004d99; padding: 25px 20px; text-align: center; color: #ffffff; }
              .header h1 { margin: 0; font-size: 26px; font-weight: 700; }
              .forward-notice { background-color: #fff3cd; color: #856404; padding: 15px 40px; text-align: center; font-size: 14px;}
              .content-section { padding: 30px 40px; }
              .content-section h2 { color: #004d99; font-size: 24px; margin-top: 0; margin-bottom: 25px; text-align: center; font-weight: 600;}
              .data-table { width: 100%; border-radius: 8px; overflow: hidden; margin-bottom: 20px; border-collapse: collapse; }
              .data-table td { padding: 12px 18px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 15px; }
              .data-table tr:last-child td { border-bottom: none; }
              .data-table td:first-child { font-weight: bold; color: #333; width: 40%; }
              .data-table a { color: #007bff; text-decoration: none; word-break: break-all; }
              .message-box { background-color: #f8faff; border: 1px solid #dbe9ff; border-radius: 10px; padding: 25px; margin-top: 25px; }
              .footer { background-color: #e9ecef; padding: 25px 20px; text-align: center; font-size: 13px; color: #777; }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header"><h1>Forwarded Inquiry</h1></div>
              <div class="forward-notice">
                  Forwarded from the admin panel. Original inquiry received on ${new Date(
                    createdAt
                  ).toLocaleString()}.
              </div>
              <div class="content-section">
                  <h2>🚀 Inquiry Details</h2>
                  <table class="data-table" role="presentation">
                      <tr><td>Full Name:</td><td>${firstName} ${lastName}</td></tr>
                      <tr><td>Email Address:</td><td><a href="mailto:${email}">${email}</a></td></tr>
                      <tr><td>Phone Number:</td><td>${phone}</td></tr>
                      <tr><td>City:</td><td>${city}</td></tr>
                  </table>

                  <table class="data-table" role="presentation" style="margin-top:20px;">
                      <tr><td>Topic:</td><td>${topic}</td></tr>
                      <tr><td>Preferred Media:</td><td>${media}</td></tr>
                      <tr><td>Advertising State:</td><td>${advertisingState}</td></tr>
                      <tr><td>Advertising Market:</td><td>${advertisingMarket}</td></tr>
                  </table>

                  <div class="message-box"><p>${message}</p></div>
              </div>
              <div class="footer"><p>This message was forwarded via the company admin panel.</p></div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Inquiry forwarded successfully to ${forwardingEmail}.`);
  } catch (error) {
    console.error("Error forwarding email:", error);
    throw new Error("Failed to forward email.");
  }
};

module.exports = {
  sendContactInquiryEmail,
  sendForwardedInquiryEmail,
  sendAtlInquiryEmail,
  sendBtlInquiryEmail,
  sendTtlInquiryEmail,
  sendBlogContactInquiryEmail,
};
