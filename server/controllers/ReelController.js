const cloudinary = require('cloudinary').v2;
const Reel = require('../models/ReelModel'); // Assuming model is in ../models/

// @desc    Get all reels
// @route   GET /api/reels
// @access  Public
const getReels = async (req, res) => {
  // Find all reels and sort them by creation date, newest first
  const reels = await Reel.find({}).sort({ createdAt: -1 });
  res.json(reels);
};

// @desc    Add a new reel
// @route   POST /api/reels
// @access  Private/Admin
const addReel = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded. Please select an image or video.');
  }

  // Upload to Cloudinary
  // resource_type: "auto" tells Cloudinary to automatically detect if it's an image or video
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "reels" // Optional: saves all reels in a 'reels' folder in Cloudinary
      },
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    ).end(req.file.buffer);
  });

  // Create new reel entry in the database
  const newReel = new Reel({
    url: uploadResult.secure_url,
    public_id: uploadResult.public_id,
    type: uploadResult.resource_type, // 'image' or 'video'
  });

  const createdReel = await newReel.save();
  res.status(201).json(createdReel);
};

// @desc    Update an existing reel
// @route   PUT /api/reels/:id
// @access  Private/Admin
const updateReel = async (req, res) => {
  const { id } = req.params;
  let { url, public_id, type } = req.body; // Expect existing data or new data if no file is uploaded

  const reel = await Reel.findById(id);

  if (!reel) {
    res.status(404);
    throw new Error('Reel not found');
  }

  // If a new file is uploaded, handle Cloudinary upload and old file deletion
  if (req.file) {
    // Delete old asset from Cloudinary if it exists
    if (reel.public_id) {
      await cloudinary.uploader.destroy(reel.public_id, {
        resource_type: reel.type,
      });
    }

    // Upload new file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "reels"
        },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Update reel details with new Cloudinary info
    reel.url = uploadResult.secure_url;
    reel.public_id = uploadResult.public_id;
    reel.type = uploadResult.resource_type;
  } else {
    // If no new file, update based on provided body data (if you want to allow updating other fields later)
    // For now, if no file is uploaded, we assume the URL/public_id/type remains the same
    // unless you plan to send these via body for other updates (e.g., a title, description)
    // If only file replacement is expected, this 'else' block might not be strictly needed for now.
  }

  const updatedReel = await reel.save();
  res.json(updatedReel);
};


// @desc    Delete a reel
// @route   DELETE /api/reels/:id
// @access  Private/Admin
const deleteReel = async (req, res) => {
  const reel = await Reel.findById(req.params.id);

  if (reel) {
    // 1. Delete the asset from Cloudinary
    // We must specify the resource_type when deleting
    await cloudinary.uploader.destroy(reel.public_id, {
      resource_type: reel.type,
    });

    // 2. Delete the record from the database
    await Reel.deleteOne({ _id: reel._id });

    res.json({ message: 'Reel removed successfully' });
  } else {
    res.status(404);
    throw new Error('Reel not found');
  }
};

module.exports = { getReels, addReel, updateReel, deleteReel };