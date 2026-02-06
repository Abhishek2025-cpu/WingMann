const express=  require("express");
const { likeUnlikeUser, getLikesForUser, getMyLikedUsers } = require("../controllers/likeController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/toggle", likeUnlikeUser, protect);

router.get("/recieved/:userId", getLikesForUser, protect);

router.get("/my-liked/:senderId", protect,getMyLikedUsers);

module.exports = router;