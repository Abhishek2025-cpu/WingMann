
const express = require("express");
const router = express.Router();

// Config file se 'upload' import karein
const { upload } = require("../config/cloudinary");

const {
  createUserData,
  getAllUserData,
  getSingleUserData,
  updateUserData,
  deleteUserData,
  uploadImages,
  getUserSummary,
  saveAvailability30MinSlots,
  getAvailabilityOfSlots
} = require("../controllers/userDatacontroller");

const { protect } = require("../middlewares/authMiddleware");

// ================= ROUTES =================

// 1. CREATE: User create karte waqt agar images bhi bhejni hain
// Note: Frontend se form-data key "images" honi chahiye
router.post("/create", upload.array("images", 6), createUserData);

// 2. UPLOAD ONLY: Sirf images upload karne ke liye (Existing users ke liye)
router.post("/upload-images", protect, upload.array("images", 6), uploadImages);

router.post("/save-30mins-slots", protect, saveAvailability30MinSlots);
router.get("/get30minSlots", protect, getAvailabilityOfSlots);

// 3. GET DATA
router.get("/get", protect, getAllUserData);
router.get("/user-summary", protect, getUserSummary);

// 4. UPDATE: Agar update karte waqt images bhi change karni hain
router.patch("/update/:id", protect, upload.array("images", 6), updateUserData);

// 5. DELETE
router.delete("/:id", protect, deleteUserData);

// 6. GET SINGLE USER (dynamic route) - MUST BE LAST
router.get("/:id", protect, getSingleUserData);

module.exports = router;
