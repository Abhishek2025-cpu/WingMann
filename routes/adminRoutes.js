const express= require("express");

const { registerAdmin, loginAdmin } = require("../controllers/adminAuthController");
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const router = express.Router();

router.post("/create-admin",  registerAdmin, adminMiddleware);

router.post("/login-admin",  loginAdmin, adminMiddleware);


module.exports = router;