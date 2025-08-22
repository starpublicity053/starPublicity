// models/ContactInquiry.js

const mongoose = require("mongoose");

const ContactInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'], // Simple email validation
    },
    message: {
      type: String,
      required: true,
    },
    // Field to track the status of the inquiry
    status: {
      type: String,
      // Updated the enum to include 'unread' and 'read'
      enum: ['unread', 'read', 'In Progress', 'Resolved', 'Closed'],
      default: 'unread', // Default status for new inquiries
    },
    // Array to store notes for the inquiry
    notes: [
      {
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

const ContactInquiry = mongoose.model("ContactInquiry", ContactInquirySchema);

module.exports = ContactInquiry;