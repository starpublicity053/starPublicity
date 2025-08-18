const express = require("express");
const router = express.Router();
const multer = require("multer");
const loginUser = require("../controllers/AdminController");
const blogController = require("../controllers/BlogController");
const blogContactController = require("../controllers/BlogContactController");
const {
  submitContactInquiry,
  getAllContactInquiries,
  forwardContactInquiry,
} = require("../controllers/ContactController");
const {
  getJobs,
  createJob,
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

// --- ✅ UPDATED: Import only the function needed for the lead generation chatbot ---
const { initiateChat } = require("../controllers/ChatbotController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Existing Routes (No Changes) ---
router.post("/login", loginUser);
router.get("/jobs", getJobs);
router.post("/jobs", createJob);
router.delete("/jobs/:id", deleteJob);
router.post("/apply", upload.single("resume"), submitApplication);
router.post("/blogs", upload.any(), blogController.createBlogPost);
router.get("/blogs", blogController.getAllBlogPosts);
router.get("/blogs/:id", blogController.getBlogPostById);
router.delete("/blogs/:id", blogController.deleteBlogPost);
router.put("/blogs/:id", upload.any(), blogController.updateBlogPost);
router.post("/contact/inquiries", blogContactController.submitContactForm);
router.post("/contact/inquiry", submitContactInquiry);
router.get("/contact/inquiries", getAllContactInquiries);
router.post("/contact/inquiries/:id/forward", forwardContactInquiry);
router.post("/ATL-inquiry", sendAtlInquiry);
router.post("/BTL-inquiry", sendBtlInquiry);
router.post("/TTL-inquiry", sendTtlInquiry);
router.get("/reels", getReels);
router.post("/reels", upload.single("reel"), addReel);
router.put("/reels/:id", upload.single("reel"), updateReel);
router.delete("/reels/:id", deleteReel);
 

// --- ✅ UPDATED: Simplified Chatbot Route ---
// This single route now receives the lead details from the frontend to be sent via email.
// The old webhook routes have been removed as they are no longer needed.
router.post('/live-chat/initiate', initiateChat);


module.exports = router;