const mongoose = require("mongoose");

const callbackRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CallbackRequest = mongoose.model(
  "CallbackRequest",
  callbackRequestSchema
);

module.exports = CallbackRequest;
