const CallbackRequest = require("../models/Media.js");
const { sendCallbackRequestEmail } = require("../service/MailService.js");

/**
 * @desc    Create a new callback request
 * @route   POST /api/media/request-callback
 * @access  Public
 */
const requestCallback = async (req, res) => {
  try {
    const { name, phone, company } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({ message: "Name and phone number are required." });
    }

    const newRequest = await CallbackRequest.create({ name, phone, company });

    // Send email notification to HR
    await sendCallbackRequestEmail({ name, phone, company });

    res
      .status(201)
      .json({ message: "Callback request received successfully." });
  } catch (error) {
    console.error("Error saving callback request:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

/**
 * @desc    Get all media inquiries
 * @route   GET /api/media
 * @access  Private/Admin
 */
const getAllMediaInquiries = async (req, res) => {
  try {
    const inquiries = await CallbackRequest.find({}).sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error("Error fetching media inquiries:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = {
  requestCallback,
  getAllMediaInquiries,
};
