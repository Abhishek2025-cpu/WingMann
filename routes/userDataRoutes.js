const express = require("express");
const router = express.Router();

// Config file se 'upload' import karein (jo abhi humne fix kiya tha)
const { upload } = require("../config/cloudinary");

const {
  createUserData,
  getAllUserData,
  getSingleUserData,
  updateUserData,
  deleteUserData,
  uploadImages,
  getUserSummary
} = require("../controllers/userDatacontroller");

const { protect } = require("../middlewares/authMiddleware");

// ================= ROUTES =================

// 1. CREATE: User create karte waqt agar images bhi bhejni hain
// Note: Frontend se form-data key "images" honi chahiye
router.post("/create", createUserData);

// 2. UPLOAD ONLY: Sirf images upload karne ke liye (Existing users ke liye)
router.post("/upload-images", protect, upload.array("images", 6), uploadImages);

// 3. GET DATA
router.get("/user-summary", protect, getUserSummary);
router.get("/get", protect, getAllUserData);

router.get("/:id", protect, getSingleUserData);


// 4. UPDATE: Agar update karte waqt images bhi change karni hain
router.patch("/update/:id", protect, upload.array("images", 6), updateUserData);

// 5. DELETE
router.delete("/:id", protect, deleteUserData);

module.exports = router;