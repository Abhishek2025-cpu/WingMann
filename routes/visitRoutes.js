const express = require("express");
const router = express.Router();

const {
  addVisit,
  checkMyVisit,
  getVisitSummary,
} = require("../controllers/visitController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/add", protect, addVisit);
router.get("/check", protect, checkMyVisit);
router.get("/summary", protect, getVisitSummary);

module.exports = router;
