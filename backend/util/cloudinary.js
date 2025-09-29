const { v2: cloudinary } = require('cloudinary');
require("dotenv").config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload a single image with optional resizing
 */
const t1UploadToCloudinary = async (filePath, publicId, width, height, folder) => {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: folder,
      resource_type: "image" // only for images
    });

    console.log("Uploaded:", res.secure_url);

    // Transform URL if width/height provided
    const url = cloudinary.url(res.public_id, {
      version: res.version,
      transformation: width && height ? [
        { width, height, crop: "fill", gravity: "auto" },
        { quality: 'auto', fetch_format: 'auto' }
      ] : [{ quality: 'auto', fetch_format: 'auto' }]
    });

    return url;
  } catch (err) {
    console.error("t1UploadToCloudinary failed:", err);
    return null;
  }
};

/**
 * Upload an image or PDF (auto-detect type)
 */
const t2UploadToCloudinary = async (filePath, publicId, folder, mimetype) => {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: folder,
      resource_type: "auto" // for images or PDFs
    });

    console.log("Uploaded:", res.secure_url);

    // Prepare return object
    const result = {
      previewUrl: res.secure_url, // preview for frontend
      uploadUrl: res.secure_url   // main upload URL
    };

    return result;
  } catch (err) {
    console.error("t2UploadToCloudinary failed:", err);
    return null;
  }
};

/**
 * Process multiple files that are already uploaded to Cloudinary
 * No re-uploading, just mapping URLs for DB storage
 */
const t3UploadToCloudinary = async (files) => {
  try {
    const ans = files.map(file => ({
      fakeName: file.name,
      previewUrl: file.url,
      uploadUrl: file.uploadUrl,
      metaData: file.metaData
    }));

    console.log("Processed files:", ans);
    return ans;
  } catch (err) {
    console.error("t3UploadToCloudinary failed:", err);
    return null;
  }
};

/**
 * Delete all resources in a folder
 */
const deleteFolderInCloudinary = async (folder) => {
  try {
    await cloudinary.api.delete_resources_by_prefix(folder);
    await cloudinary.api.delete_folder(folder);
    return true;
  } catch (err) {
    console.error("deleteFolderInCloudinary failed:", err);
    return null;
  }
};

module.exports = {
  t1UploadToCloudinary,
  t2UploadToCloudinary,
  t3UploadToCloudinary,
  deleteFolderInCloudinary
};
