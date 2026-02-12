const express = require("express");
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const { addRestaurant, getAllRestaurants, updateRestaurant, deleteRestaurant } = require("../controllers/restaurant.controller");
const { upload } = require("../config/cloudinary");
const router = express.Router();

router.post(
  "/add",
  adminMiddleware,
  upload.array("venuePhotos", 10), // ✅ multiple images
  addRestaurant
);

router.get("/all", adminMiddleware, getAllRestaurants);

router.put(
  "/update/:id",
  adminMiddleware,
  upload.array("venuePhotos", 10), // ✅ multiple images
  updateRestaurant
);

router.delete("/delete/:id", adminMiddleware, deleteRestaurant);

module.exports = router;