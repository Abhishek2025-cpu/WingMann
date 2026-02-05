const multer = require("multer");
const path = require("path");

// 1. Storage Configuration (Temporary memory storage for Cloudinary)
const storage = multer.diskStorage({
  // If you are using Cloudinary, you can often use 'multer.memoryStorage()' 
  // or just the diskStorage to temporarily hold files.
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// 2. File Filter (Validation)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG and WebP are allowed."), false);
  }
};

// 3. Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per image
  },
});

module.exports = upload;