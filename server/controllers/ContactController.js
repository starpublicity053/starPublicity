// controllers/ContactController.js
const ContactInquiry = require('../models/Contact');
const { sendContactInquiryEmail, sendForwardedInquiryEmail } = require('../service/MailService');

// Handles submission from your contact form
const submitContactInquiry = async (req, res) => {
  try {
    const inquiry = new ContactInquiry(req.body);
    const savedInquiry = await inquiry.save();
    
    // Send email notification with the correct data
    await sendContactInquiryEmail(savedInquiry);

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully!', data: savedInquiry });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Gets all inquiries for the admin panel
const getAllContactInquiries = async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries.' });
  }
};

const forwardContactInquiry = async (req, res) => {
  try {
    const { forwardingEmail } = req.body;
    if (!forwardingEmail) {
      return res.status(400).json({ message: 'Forwarding email is required.' });
    }

    const inquiryData = await ContactInquiry.findById(req.params.id);
    if (!inquiryData) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    // --- THIS IS THE FIX ---
    // Pass a single object containing both pieces of data.
    // This matches the structure your MailService.js function expects.
    await sendForwardedInquiryEmail({ inquiryData, forwardingEmail });
    
    // Update the inquiry to mark it as forwarded
    inquiryData.isForwarded = true;
    await inquiryData.save();

    res.status(200).json({ success: true, message: `Inquiry forwarded to ${forwardingEmail}` });
  } catch (error) {
    // This console.error will now give you more accurate information if an error occurs inside MailService.js
    console.error('Error in forwardContactInquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to forward inquiry.' });
  }
};

module.exports = {
  submitContactInquiry,
  getAllContactInquiries,
  forwardContactInquiry,
};