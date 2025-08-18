const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  // The public URL of the uploaded file from Cloudinary
  url: {
    type: String,
    required: true,
  },
  // The unique identifier for the asset in Cloudinary, used for deletion
  public_id: {
    type: String,
    required: true,
    unique: true,
  },
  // The type of the media, either 'image' or 'video'
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Reel = mongoose.model('Reel', reelSchema);

module.exports=Reel;