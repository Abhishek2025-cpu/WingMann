const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Config check (Optional: Debugging ke liye)
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.error("⚠️ Cloudinary Config Missing! Check your .env file.");
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "WingMann/users",
      // format property optional hai, agar aap chahte hain ki sab webp me convert ho to ise uncomment karein
      // format: "webp", 
      allowed_formats: ["jpg", "png", "jpeg", "webp"], // Sirf ye formats allowed honge
      public_id: `${Date.now()}-${file.originalname.split(".")[0].replace(/\s+/g, "_")}`, // Spaces ko underscore se replace kiya
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    // Check karein ki file image hi hai ya nahi
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"), false);
    }
  },
});

module.exports = { cloudinary, upload };