const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinaryUploadImage = async (files) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(files, (result) => {
      resolve({ url: result.secure_url }, { resorce_type: "auto" });
    });
  });
};

module.exports = { cloudinaryUploadImage };
