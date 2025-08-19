const { sendTtlInquiryEmail } = require("../service/MailService");

/**
 * Handles inquiries from the TTL page modal form.
 * Validates required fields and triggers email notifications.
 */
const sendTtlInquiry = async (req, res) => {
  // Destructure the expected fields from the new modal form
  const { firstName, lastName, email, phoneNumber } = req.body;

  // Updated validation to match the modal's fields
  if (!firstName || !lastName || !email || !phoneNumber) {
    return res.status(400).json({ message: "Missing required form fields." });
  }

  // Create a complete formData object to ensure compatibility with notification services
  const formData = {
    ...req.body,
    // Provide a default message, as it's no longer a field in the modal
    message: `Inquiry from: ${firstName} ${lastName}. Contact: ${email}, ${phoneNumber}.`,
  };

  try {
    // Send Email to admin
    await sendTtlInquiryEmail(formData);
    console.log("✅ Email sent successfully.");

    return res.status(200).json({
      message:
        "Inquiry sent successfully! We will get back to you shortly.",
    });
  } catch (error) {
    console.error("❌ Fatal error processing TTL inquiry:", error);
    return res.status(500).json({
      message:
        error.message || "An internal server error occurred.",
    });
  }
};

module.exports = { sendTtlInquiry };