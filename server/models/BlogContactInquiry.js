// models/BlogContactInquiry.js
const mongoose = require('mongoose');

const blogContactInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
  },
  company: {
    type: String,
    trim: true,
    default: '',
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  serviceOfInterest: {
    type: String,
    trim: true,
    default: '',
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Removed isForwarded and forwardedAt fields as requested.
  // If you later decide to link an inquiry to a specific blog post,
  // you would add a field like this:
  // blogPost: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'BlogPost', // Assuming your blog post model is named 'BlogPost'
  //   required: false // Or true, if every inquiry must be linked to a blog
  // }
});

const BlogContactInquiry = mongoose.model('BlogContactInquiry', blogContactInquirySchema);

module.exports = BlogContactInquiry;