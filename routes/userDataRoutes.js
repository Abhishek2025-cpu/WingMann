const express = require("express");
const router = express.Router();

const {upload} = require("../config/cloudinary")

const {
  createUserData,
  getAllUserData,
  getSingleUserData,
  updateUserData,
  deleteUserData,
  uploadImages
} = require("../controllers/userDatacontroller");
const { protect } = require("../middlewares/authMiddleware");


// images field name = "images"
router.post("/create", upload.array("images", 10), createUserData, protect);
router.post(
  "/upload-images", 
  upload.array("images", 6), 
  uploadImages, protect
);
router.get("/get", getAllUserData, protect);
router.get("/:id", getSingleUserData, protect);

router.patch("/update/:id", updateUserData)

router.delete("/:id", deleteUserData, protect);

module.exports = router;
