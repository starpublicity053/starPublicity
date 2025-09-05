const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  getAdmins,
  inviteAdmin,
  updateAdminRole,
  updateAdminStatus,
  deleteAdmin,
} = require("../controllers/AdminController"); // Adjust path if needed

// --- You need to create these middleware functions ---
// This middleware should verify the JWT and attach the user to req.user
const protect = require("../middleware/authMiddleware");
// This middleware should check if req.user.isSuperAdmin === 1
const restrictToSuperAdmin = require("../middleware/superAdminMiddleware");

const {
  requestCallback,
  getAllMediaInquiries,
} = require("../controllers/MediaController");

const multer = require("multer");
const blogController = require("../controllers/BlogController");
const blogContactController = require("../controllers/BlogContactController");
const {
  submitContactInquiry,
  getAllContactInquiries,
  forwardContactInquiry,
  updateContactInquiryStatus, // ✅ New Import
  addContactInquiryNote, // ✅ New Import
} = require("../controllers/ContactController");
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  submitApplication,
} = require("../controllers/JobController");
const { sendAtlInquiry } = require("../controllers/AtlController");
const { sendBtlInquiry } = require("../controllers/BtlController");
const { sendTtlInquiry } = require("../controllers/TtlController");
const {
  getReels,
  addReel,
  updateReel,
  deleteReel,
} = require("../controllers/ReelController");

const { initiateChat } = require("../controllers/ChatbotController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Authentication Routes ---
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// --- Admin Management Routes (Protected) ---
router.get("/admins", protect, restrictToSuperAdmin, getAdmins);
router.post("/admins/invite", protect, restrictToSuperAdmin, inviteAdmin);
router.put("/admins/:id/role", protect, restrictToSuperAdmin, updateAdminRole);
router.put(
  "/admins/:id/status",
  protect,
  restrictToSuperAdmin,
  updateAdminStatus
);
router.delete("/admins/:id", protect, restrictToSuperAdmin, deleteAdmin);

router.get("/jobs", getJobs);
router.post("/jobs", createJob);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);
router.post("/apply", upload.single("resume"), submitApplication);
router.post("/blogs", upload.any(), blogController.createBlogPost);
router.get("/blogs", blogController.getAllBlogPosts);
router.get("/blogs/:id", blogController.getBlogPostById);
router.delete("/blogs/:id", blogController.deleteBlogPost);
router.put("/blogs/:id", upload.any(), blogController.updateBlogPost);
router.post("/contact/inquiries", blogContactController.submitContactForm);

// --- ✅ UPDATED CONTACT INQUIRY ROUTES ---
// This is the route for your main contact form submission.
router.post("/contact/inquiry", submitContactInquiry);
// This route fetches all inquiries for the admin panel.
router.get("/contact/inquiries", getAllContactInquiries);
// This route forwards an inquiry to another email.
router.post("/contact/inquiries/:id/forward", forwardContactInquiry);
// ✅ NEW ROUTE: Update the status of an inquiry.
router.patch("/contact/inquiries/:id/status", updateContactInquiryStatus);
// ✅ NEW ROUTE: Add a new note to an inquiry.
router.post("/contact/inquiries/:id/notes", addContactInquiryNote);

router.post("/media/request-callback", requestCallback);
// This route fetches all media inquiries for the admin panel (protected).
router.get("/media", getAllMediaInquiries);

// --- Other Existing Routes ---
router.post("/ATL-inquiry", sendAtlInquiry);
router.post("/BTL-inquiry", sendBtlInquiry);
router.post("/TTL-inquiry", sendTtlInquiry);
router.get("/reels", getReels);
router.post("/reels", upload.single("reel"), addReel);
router.put("/reels/:id", upload.single("reel"), updateReel);
router.delete("/reels/:id", deleteReel);

// --- ✅ UPDATED: Simplified Chatbot Route ---
router.post("/live-chat/initiate", initiateChat);

module.exports = router;
