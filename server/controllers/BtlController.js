// controllers/BtlController.js

const { sendBtlInquiryEmail } = require("../service/MailService");
const {
  sendBtlInquiryWhatsApp,
  sendUserConfirmationWhatsApp,
} = require("./whatsapp-web");

/**
 * Handles inquiries from the BTL page modal form.
 * Validates required fields and triggers email and WhatsApp notifications.
 */
const sendBtlInquiry = async (req, res) => {
  // Destructure the expected fields from the new modal form
  const { firstName, lastName, email, phoneNumber } = req.body;

  // Updated validation to match the fields from the React component
  if (!firstName || !lastName || !email || !phoneNumber) {
    return res.status(400).json({ message: "Missing required form fields." });
  }

  // Create a complete formData object to ensure compatibility with notification services
  // This adds a default message, as it's no longer a user-submitted field.
  const formData = {
    ...req.body,
    message: `New BTL inquiry from: ${firstName} ${lastName}. Contact: ${email}, ${phoneNumber}.`,
  };

  try {
    // Send Email to Admin
    await sendBtlInquiryEmail(formData);
    console.log("✅ BTL Email sent successfully.");

    // Send WhatsApp to Admin
    try {
      await sendBtlInquiryWhatsApp(formData);
      console.log("✅ Admin WhatsApp for BTL sent successfully.");
    } catch (whatsAppError) {
      console.warn(
        "⚠️ Failed to send WhatsApp to admin:",
        whatsAppError.message
      );
    }

    // Send Confirmation WhatsApp to User
    try {
      await sendUserConfirmationWhatsApp(formData);
      console.log("✅ User WhatsApp confirmation for BTL sent.");
    } catch (userWhatsAppError) {
      console.warn(
        "⚠️ Failed to send WhatsApp to user:",
        userWhatsAppError.message
      );
    }

    // Return a clear success response
    return res.status(200).json({
      message: "Inquiry sent successfully! We will contact you shortly.",
    });
  } catch (error) {
    console.error("❌ Fatal error processing BTL inquiry:", error);
    return res.status(500).json({
      message: error.message || "An internal server error occurred.",
    });
  }
};

module.exports = { sendBtlInquiry };