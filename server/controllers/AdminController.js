const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const { sendWhatsAppMessage } = require("./whatsapp-web.js"); // 🔥 Corrected import path to whatsappService.js

const loginUser = async (req, res) => {
  // Remove 'role' from req.body destructuring, as it is not sent by the client during login.
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Ensure the user object retrieved from the database has a role
    if (!user.role) {
      console.error("User found, but role is missing in the database.");
      // Optional: Handle error or default role if needed
    }

    const token = jwt.sign(
      // Correctly embedding user.role in the JWT payload
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send WhatsApp message to ADMIN_PHONE upon successful login
    if (typeof sendWhatsAppMessage === "function") {
      // Pass ADMIN_PHONE as the recipient, and the message content
      await sendWhatsAppMessage(
            process.env.ADMIN_PHONE, // 🔥 Recipient is ADMIN_PHONE (sends to self)
            `✅ ${user.role} (${email}) logged in to the Admin Portal at ${new Date().toLocaleString()}`
      );
    }

    // Return the correct role in the response
    res.json({ token, role: user.role, email: user.email });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = loginUser;