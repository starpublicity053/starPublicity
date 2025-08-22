// controllers/ContactController.js
const ContactInquiry = require('../models/Contact');
const {
  sendContactInquiryEmail,
  sendForwardedInquiryEmail,
} = require('../service/MailService');

/**
 * Handles submission from the contact form with `name`, `email`, and `message` fields.
 * It creates a new inquiry in the database and sends an email notification.
 */
const submitContactInquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required.' });
    }

    // Create a new inquiry
    const inquiry = new ContactInquiry({
      name,
      email,
      message,
    });

    const savedInquiry = await inquiry.save();

    // Send notification email
    await sendContactInquiryEmail(savedInquiry);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully!',
      data: savedInquiry,
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Gets all inquiries for the admin panel, sorted by creation date.
 */
const getAllContactInquiries = async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch inquiries.' });
  }
};

/**
 * Forwards a specific contact inquiry to another email address.
 */
const forwardContactInquiry = async (req, res) => {
  try {
    const { forwardingEmail } = req.body;

    if (!forwardingEmail) {
      return res
        .status(400)
        .json({ success: false, message: 'Forwarding email is required.' });
    }

    const inquiryData = await ContactInquiry.findById(req.params.id);
    if (!inquiryData) {
      return res
        .status(404)
        .json({ success: false, message: 'Inquiry not found.' });
    }

    // Send forwarded inquiry email
    await sendForwardedInquiryEmail({ inquiryData, forwardingEmail });

    // Track forwarding in notes
    inquiryData.notes.push({
      content: `Inquiry forwarded to ${forwardingEmail}`,
    });
    await inquiryData.save();

    res.status(200).json({
      success: true,
      message: `Inquiry forwarded to ${forwardingEmail}`,
    });
  } catch (error) {
    console.error('Error forwarding inquiry:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to forward inquiry.' });
  }
};

/**
 * Updates the status of a specific inquiry.
 */
const updateContactInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: 'Inquiry not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully.',
      data: inquiry,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to update status.' });
  }
};

/**
 * Adds a new note to a specific inquiry.
 */
const addContactInquiryNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: 'Note content is required.' });
    }

    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: 'Inquiry not found.' });
    }

    inquiry.notes.push({ content });
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Note added successfully.',
      data: inquiry,
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to add note.' });
  }
};

module.exports = {
  submitContactInquiry,
  getAllContactInquiries,
  forwardContactInquiry,
  updateContactInquiryStatus,
  addContactInquiryNote,
};
