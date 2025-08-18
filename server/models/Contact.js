// models/Contact.js
const mongoose = require("mongoose");

const ContactInquirySchema = new mongoose.Schema(
  {
    // Fields from your specific form
    advertisingState: { type: String, required: true },
    advertisingMarket: { type: String, required: true },
    topic: { type: String, required: true },
    media: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    message: { type: String, required: true },
    // Field to track forwarding status
    isForwarded: { type: Boolean, default: false },
    // NEW FIELD: Status of the inquiry
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Resolved', 'Closed'], // Define allowed statuses
      default: 'New', // Default status for new inquiries
    },
    // NEW FIELD: Array to store notes for the inquiry
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
