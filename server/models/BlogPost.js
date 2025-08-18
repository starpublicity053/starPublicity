// models/BlogPost.js
const mongoose = require('mongoose');

// Schema for individual content blocks (paragraph, heading, etc.)
// This schema perfectly matches the 'contentBlocks' state in your AdminPanel.jsx,
// allowing for flexible and structured blog content.
const blockSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Matches the unique ID generated on the frontend
  type: {
    type: String,
    required: true,
    enum: ['paragraph', 'heading', 'image', 'quote'] // Enforces correct block types
  },
  text: { type: String, default: '' },
  level: { type: Number, default: 2 }, // For H2, H3, etc.
  url: { type: String, default: '' }, // Stores the final Cloudinary URL for images
  imageId: { type: String, default: '' }, // Stores the Cloudinary public_id for deletion
  caption: { type: String, default: '' },
  author: { type: String, default: '' } // For the 'quote' block type
}, { _id: false }); // _id is not needed for sub-documents here

const blogPostSchema = new mongoose.Schema({
  // The 'title' field is populated by 'blogTitle' from your admin panel
  title: {
    type: String,
    required: true,
    trim: true
  },
  // The 'author' field is populated by 'blogAuthor' from your admin panel
  author: {
    type: String,
    required: true,
  },
  // The 'content' is an array of blocks, matching your frontend's structure
  content: {
    type: [blockSchema],
    default: []
  },
  // Tags are stored as an array of strings
  tags: {
    type: [String],
    default: [],
  },
  // Data for the Key Highlights section
  keyHighlightsTitle: {
    type: String,
    default: "What you'll learn in this blog",
  },
  keyHighlights: {
    type: [String],
    default: [],
  },
  // Details for the featured image uploaded to Cloudinary
  imageUrl: {
    type: String,
    required: true
  },
  imageId: {
    type: String,
    required: true
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt, useful for sorting

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;