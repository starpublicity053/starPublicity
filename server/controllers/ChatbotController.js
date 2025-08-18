const nodemailer = require("nodemailer");

/**
 * @description This is the core function for your lead generation chatbot.
 * It receives the user's message and phone number, then sends it to your HR email.
 * This is the function that your frontend's `useInitiateLiveChatMutation` hook should call.
 */
exports.initiateChat = async (req, res) => {
  // 1. Get the lead details from the chatbot frontend
  const { phoneNumber, message } = req.body;

  // 2. Validate the incoming data
  if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
    return res
      .status(400)
      .json({ error: "A valid 10-digit phone number is required." });
  }
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "A message is required." });
  }

  // 3. Set up the email transporter using Nodemailer
  // It now reads the new HR_EMAIL credentials from your .env file
  const transporter = nodemailer.createTransport({
    service: "gmail", // Or your preferred email service
    auth: {
      user: process.env.HR_EMAIL,
      pass: process.env.HR_EMAIL_PASSWORD,
    },
    // ADD THIS PART TO BYPASS THE CERTIFICATE CHECK
    tls: {
      rejectUnauthorized: false,
    },
  });

  // 4. Create the email content
  const mailOptions = {
    from: `"Chatbot Lead" <${process.env.HR_EMAIL}>`,
    to: process.env.HR_RECEIVER_EMAIL, // The HR email you want to receive leads at
    subject: `New Lead from Website Chatbot: ${phoneNumber}`,
    html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #4F46E5;">New Lead from Website Chatbot</h2>
                <p>You have received a new lead from the Star Publicity website chatbot.</p>
                <hr>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>Initial Message:</strong></p>
                <blockquote style="background-color: #f9f9f9; border-left: 5px solid #ccc; padding: 10px; margin: 0;">
                    ${message}
                </blockquote>
                <hr>
                <p><em>This is an automated notification. Please contact the lead directly.</em></p>
            </div>
        `,
  };

  // 5. Send the email and respond to the frontend
  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `✅ Lead notification sent successfully to ${process.env.HR_RECEIVER_EMAIL}`
    );
    res
      .status(200)
      .json({
        status: "success",
        message: "Lead captured and notification sent.",
      });
  } catch (error) {
    console.error("🔴 Error sending lead notification email:", error);
    res.status(500).json({ error: "Failed to send lead notification." });
  }
};
