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
    let cleanPublicId = publicId;

    // For PDFs, ensure publicId doesn't include file extension to avoid double extensions
    if (mimetype === 'application/pdf') {
      // Remove any existing file extension from publicId
      const lastDotIndex = publicId.lastIndexOf('.');
      if (lastDotIndex > 0 && lastDotIndex < publicId.length - 1) {
        cleanPublicId = publicId.substring(0, lastDotIndex);
      }
    }

    if (mimetype.startsWith('image/')) {
      // For images, upload normally
      const uploadOptions = {
        public_id: cleanPublicId,
        folder: folder,
        resource_type: 'image',
        access_mode: "authenticated"// Ensure public access for all uploaded resources
      };

      const res = await cloudinary.uploader.upload(filePath, uploadOptions);
      console.log("Uploaded image:", res.secure_url);

      const result = {
        previewUrl: res.secure_url, // image preview
        uploadUrl: res.secure_url   // same for images
      };

      return result;
    } else if (mimetype === 'application/pdf') {
      // For PDFs, upload twice: thumbnail (first page as image) and full PDF (raw)

      // Upload thumbnail (first page as image)
      const thumbnailOptions = {
        public_id: `${cleanPublicId}_thumb`,
        folder: folder,
        resource_type: 'image',
        format: 'jpg',
        access_mode: "authenticated"
      };

      const thumbnailRes = await cloudinary.uploader.upload(filePath, thumbnailOptions);
      console.log("Uploaded PDF thumbnail:", thumbnailRes.secure_url);

      // Upload full PDF as raw
      const pdfOptions = {
        public_id: `${cleanPublicId}`,
        folder: folder,
        resource_type: 'raw',
        format: 'pdf',
        access_mode: "authenticated"
      };

      const pdfRes = await cloudinary.uploader.upload(filePath, pdfOptions);
      console.log("Uploaded PDF:", pdfRes.secure_url);

      const result = {
        previewUrl: thumbnailRes.secure_url, // image thumbnail for frontend preview
        uploadUrl: pdfRes.secure_url      // full PDF URL
      };

      return result;
    } else {
      // Fallback for other types
      const uploadOptions = {
        public_id: cleanPublicId,
        folder: folder,
        resource_type: 'auto',
        access_mode: "authenticated"
      };

      const res = await cloudinary.uploader.upload(filePath, uploadOptions);
      console.log("Uploaded:", res.secure_url);

      const result = {
        previewUrl: res.secure_url,
        uploadUrl: res.secure_url
      };

      return result;
    }
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
    if (err.error && err.error.message.includes("Can't find folder")) {
      return true; // Folder doesn't exist, but resources deleted if any, consider successful
    }
    return null;
  }
};

module.exports = {
  t1UploadToCloudinary,
  t2UploadToCloudinary,
  t3UploadToCloudinary,
  deleteFolderInCloudinary
};
