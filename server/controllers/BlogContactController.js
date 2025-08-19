const ContactInquiry = require('../models/BlogContactInquiry');
const { 
  sendBlogContactInquiryEmail 
} = require('../service/MailService'); // Import the email sender

// @desc      Handle blog contact form submission
// @route     POST /api/contact/inquiries
// @access    Public
exports.submitContactForm = async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      phone,
      serviceOfInterest,
      message,
    } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    // Create new inquiry
    const inquiry = new ContactInquiry({
      name,
      email,
      company,
      phone,
      serviceOfInterest,
      message,
      submittedAt: new Date(),
    });

    await inquiry.save();

    // Prepare formData for notifications
    const formData = {
      name,
      email,
      company,
      phone,
      serviceOfInterest,
      message,
      submittedAt: inquiry.submittedAt,
    };

    // Send email to HR
    try {
      await sendBlogContactInquiryEmail(formData);
    } catch (mailErr) {
      console.error('Failed to send inquiry email:', mailErr.message);
    }

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully.' });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};