const User = require("../models/User"); // Adjust path to your User model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer"); // Or your preferred email library

// --- Helper for sending email (configure with your email service) ---
const sendEmail = async (options) => {
  // This is a placeholder. Replace with your actual email sending logic.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "587",
    secure: false,
    service: "gmail",
    auth: {
      user: process.env.HR_EMAIL,
      pass: process.env.HR_EMAIL_PASSWORD,
    },
    // This is for development only, to bypass self-signed certificate errors.
    // In production, you should have a valid certificate chain.
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "Star Publicity <no-reply@starpublicity.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

// 1. User Registration
exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      isAdmin: 0,
      isSuperAdmin: 0,
    });

    res.status(201).json({
      message: "User registered successfully. Please log in.",
      userId: newUser._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error during registration",
        error: error.message,
      });
  }
};

// 2. User Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[DEBUG] Login attempt for email: ${email}`);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Crucial: .select('+password') is needed to retrieve the password hash
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log(`[DEBUG] Login failed: User not found for email: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`[DEBUG] User found: ${user.email}. Comparing password...`);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(
        `[DEBUG] Login failed: Password does not match for user: ${email}`
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status === "inactive") {
      return res
        .status(403)
        .json({ message: "Your account is inactive. Please contact support." });
    }

    // Check for both casings to be robust against manual DB entry errors.
    const isSuper = user.isSuperAdmin === 1;
    const isAdmin = user.isAdmin === 1;

    // Determine user role. Super admin has precedence.
    let role;
    if (isSuper) {
      role = "superAdmin";
    } else if (isAdmin) {
      role = "admin";
    } else {
      // If user is neither, they are not approved to log in.
      console.log(
        `[DEBUG] Login failed: Account for ${email} is not approved.`
      );
      return res
        .status(403)
        .json({
          message: "Your account has not been approved by an administrator.",
        });
    }

    const payload = {
      id: user._id,
      name: user.name, // Add name to the payload
      email: user.email,
      role: role,
      isSuperAdmin: isSuper ? 1 : 0,
      isAdmin: isAdmin ? 1 : 0,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: payload, // Return the full payload as the user object
    });
  } catch (error) {
    console.error("[DEBUG] SERVER ERROR DURING LOGIN:", error);
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

// 3. Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // To prevent email enumeration, we send a success response even if the user doesn't exist.
      return res
        .status(200)
        .json({
          message: "If a user with that email exists, an OTP has been sent.",
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    const message = `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`;

    await sendEmail({
      email: user.email,
      subject: "Your Password Reset OTP",
      message,
    });

    res.status(200).json({ message: "OTP sent to email!" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    // Do not expose detailed errors to the client
    res
      .status(500)
      .json({ message: "Error sending email. Please try again later." });
  }
};

// 4. Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { otp, password } = req.body;

    const user = await User.findOne({
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "OTP is invalid or has expired" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error during password reset",
        error: error.message,
      });
  }
};

// --- Admin Management (Protected Routes) ---
// NOTE: These routes should be protected by an authentication middleware
// that checks for `isSuperAdmin` status and attaches user info to `req.user`.

// 5. Get All Admins
exports.getAdmins = async (req, res) => {
  try {
    // Find all users that have admin or superAdmin privileges
    const admins = await User.find({
      $or: [{ isAdmin: 1 }, { isSuperAdmin: 1 }],
    })
      .select("_id name email isAdmin isSuperAdmin status") // Explicitly select the fields needed
      .lean(); // Use .lean() for better performance

    // Map over the raw admin objects to create a consistent and clean structure for the frontend.
    const formattedAdmins = admins.map((admin) => {
      const isSuper = admin.isSuperAdmin === 1;
      return {
        _id: admin._id,
        // This is the crucial part. We ensure a 'name' property always exists.
        // If the database record is old and doesn't have a name, we provide a fallback.
        name: admin.name || admin.email.split("@")[0], // Fallback to part of the email
        email: admin.email,
        role: isSuper ? "superAdmin" : "admin",
        status: admin.status || "active", // Also provide a fallback for status
      };
    });

    res.status(200).json(formattedAdmins);
  } catch (error) {
    console.error("Server error fetching admins:", error); // Add logging
    res
      .status(500)
      .json({ message: "Server error fetching admins", error: error.message });
  }
};

// 6. Invite Admin
exports.inviteAdmin = async (req, res) => {
  try {
    // Now accepts password from the request, aligning with user expectation.
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists." });
    }

    // Hash the password provided in the form.
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: 1,
      isSuperAdmin: role === "superAdmin" ? 1 : 0, // Allow creating super admins
      status: "active",
    });

    res.status(201).json({
      message: `Admin account for ${name} created successfully.`,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.isSuperAdmin ? "superAdmin" : "admin",
      },
    });
  } catch (error) {
    // If email sending fails, the user is still created. You might want to handle this more gracefully.
    res
      .status(500)
      .json({ message: "Server error inviting admin", error: error.message });
  }
};

// 7. Update Admin Role
exports.updateAdminRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "superAdmin", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found." });
    }

    if (
      String(req.user.id) === String(userToUpdate._id) &&
      userToUpdate.isSuperAdmin &&
      role !== "superAdmin"
    ) {
      if ((await User.countDocuments({ isSuperAdmin: 1 })) <= 1) {
        return res
          .status(400)
          .json({ message: "Cannot demote the only super admin." });
      }
    }

    userToUpdate.isAdmin = role === "admin" || role === "superAdmin" ? 1 : 0;
    userToUpdate.isSuperAdmin = role === "superAdmin" ? 1 : 0;
    await userToUpdate.save({ validateBeforeSave: false });

    res.status(200).json({ message: `User role updated to ${role}.` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error updating role", error: error.message });
  }
};

// 8. Update Admin Status
exports.updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status specified." });
    }

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found." });
    }

    if (
      String(req.user.id) === String(userToUpdate._id) &&
      status === "inactive"
    ) {
      if (
        (await User.countDocuments({ isSuperAdmin: 1, status: "active" })) <= 1
      ) {
        return res
          .status(400)
          .json({ message: "Cannot deactivate the only active super admin." });
      }
    }

    userToUpdate.status = status;
    await userToUpdate.save({ validateBeforeSave: false });

    res.status(200).json({ message: `User status updated to ${status}.` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error updating status", error: error.message });
  }
};

// 9. Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (String(req.user.id) === id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account." });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error deleting user", error: error.message });
  }
};
