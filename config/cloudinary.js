const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// 1. Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// 2. Setup Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_data_images", // The folder name in your Cloudinary dashboard
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => `user_${Date.now()}_${file.originalname.split('.')[0]}`,
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };