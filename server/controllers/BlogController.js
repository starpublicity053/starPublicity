// controllers/BlogController.js
const BlogPost = require("../models/BlogPost");
const cloudinary = require("../config/Cloudinary");
const streamifier = require("streamifier");

// Helper to upload an image buffer to Cloudinary
const uploadImageToCloudinary = (fileBuffer, folder, transformation = []) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return resolve(null);
    const stream = cloudinary.uploader.upload_stream(
      { folder, transformation },
      (error, result) => {
        error ? reject(error) : resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Helper to delete an image from Cloudinary
const deleteImageFromCloudinary = (publicId) => {
  return new Promise((resolve) => {
    if (!publicId) return resolve(null);
    cloudinary.uploader.destroy(publicId, () => resolve(null));
  });
};

// Create a new blog post
exports.createBlogPost = async (req, res) => {
  try {
    const { title, author, tags, keyHighlightsTitle, keyHighlights, content, slug } =
      req.body;

    const contentBlocks = JSON.parse(content);
    const featuredImageFile = req.files.find((f) => f.fieldname === "image");
    if (!featuredImageFile) {
      return res.status(400).json({ message: "A featured image is required." });
    }

    // Upload featured image
    const featuredUploadResult = await uploadImageToCloudinary(
      featuredImageFile.buffer,
      "blog_featured_images"
    );

    for (const block of contentBlocks) {
      if (block.type === 'image' && block.url && block.url.startsWith('placeholder:')) {
        const blockId = block.url.split(':')[1];
        // Multer stores files keyed by their fieldname. We can access it directly.
        const imageFile = req.files.find(f => f.fieldname === `contentImage_${blockId}`);
        if (imageFile) {
          // Apply transformations ONLY to content images to make them smaller
          const result = await uploadImageToCloudinary(
            imageFile.buffer,
            'blog_content_images',
            [
              {
                // Resize to a max width of 800px, keeping aspect ratio.
                // This is a good balance for quality and size.
                width: 800,
                crop: 'limit'
              }
            ]);
          block.url = result.secure_url;
          block.imageId = result.public_id;
        } else {
          block.url = '';
        }
      }
    }

    const newPost = new BlogPost({
      title: title, // FIXED: Use the correct variable
      author: author, // FIXED: Use the correct variable
      tags: JSON.parse(tags || "[]"),
      keyHighlightsTitle,
      keyHighlights: JSON.parse(keyHighlights || "[]"),
      imageUrl: featuredUploadResult.secure_url,
      slug,
      imageId: featuredUploadResult.public_id,
      content: contentBlocks,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Blog post created successfully!", blog: newPost });
  } catch (error) {
    console.error("Error creating blog post:", error); // Added for better debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing blog post
exports.updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, tags, keyHighlightsTitle, keyHighlights, content, slug } =
      req.body;

    const blogToUpdate = await BlogPost.findById(id);
    if (!blogToUpdate)
      return res.status(404).json({ message: "Blog not found" });

    const incomingContentBlocks = JSON.parse(content);

    // Handle Featured Image Update
    let newImageUrl = blogToUpdate.imageUrl;
    let newImageId = blogToUpdate.imageId;
    const newFeaturedImageFile = req.files.find((f) => f.fieldname === "image");
    if (newFeaturedImageFile) {
      await deleteImageFromCloudinary(blogToUpdate.imageId);
      const result = await uploadImageToCloudinary(
        newFeaturedImageFile.buffer,
        "blog_featured_images"
      );
      newImageUrl = result.secure_url;
      newImageId = result.public_id;
    }

    // Handle Content Images Update (delete old, upload new)
    const oldImageIds = (blogToUpdate.content || [])
      .filter((b) => b.type === "image" && b.imageId)
      .map((b) => b.imageId);
    const retainedImageIds = incomingContentBlocks
      .filter((b) => b.type === "image" && b.imageId)
      .map((b) => b.imageId);
    const imageIdsToDelete = oldImageIds.filter(
      (oldId) => !retainedImageIds.includes(oldId)
    );
    await Promise.all(
      imageIdsToDelete.map((id) => deleteImageFromCloudinary(id))
    );

    for (const block of incomingContentBlocks) {
      if (block.type === 'image' && block.url && block.url.startsWith('placeholder:')) {
        const blockId = block.url.split(':')[1];
        const imageFile = req.files.find(f => f.fieldname === `contentImage_${blockId}`);
        if (imageFile) {
          // Also apply transformations on update
          const result = await uploadImageToCloudinary(
            imageFile.buffer,
            'blog_content_images',
            [
              {
                // Resize to a max width of 800px, keeping aspect ratio.
                // This is a good balance for quality and size.
                width: 800,
                crop: 'limit'
              }
            ]);
          block.url = result.secure_url;
          block.imageId = result.public_id;
        } else {
          block.url = '';
        }
      }
    }

    // Update fields in the database
    blogToUpdate.title = title; // FIXED: Use the correct variable
    blogToUpdate.author = author; // FIXED: Use the correct variable
    blogToUpdate.tags = JSON.parse(tags || "[]");
    blogToUpdate.keyHighlightsTitle = keyHighlightsTitle;
    blogToUpdate.keyHighlights = JSON.parse(keyHighlights || "[]");
    blogToUpdate.slug = slug;
    blogToUpdate.imageUrl = newImageUrl;
    blogToUpdate.imageId = newImageId;
    blogToUpdate.content = incomingContentBlocks;

    const updatedBlog = await blogToUpdate.save();
    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog post:", error); // Added for better debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all blog posts
exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogs = await BlogPost.find({}).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching all blogs:", error); // Added for better debugging
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single blog post by ID
exports.getBlogPostById = async (req, res) => {
  try {
    // Fetch by slug or ID for flexibility
    const blog = await BlogPost.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog by ID:", error); // Added for better debugging
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a blog post
exports.deleteBlogPost = async (req, res) => {
  try {
    const blogToDelete = await BlogPost.findById(req.params.id);
    if (!blogToDelete)
      return res.status(404).json({ message: "Blog post not found" });

    // Delete all associated images from Cloudinary
    await deleteImageFromCloudinary(blogToDelete.imageId);
    for (const block of blogToDelete.content) {
      if (block.type === "image" && block.imageId) {
        await deleteImageFromCloudinary(block.imageId);
      }
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog post deleted successfully!" });
  } catch (error) {
    console.error("Error deleting blog post:", error); // Added for better debugging
    res.status(500).json({ message: "Server error" });
  }
};
