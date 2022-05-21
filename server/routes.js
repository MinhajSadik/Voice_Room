const router = require("express").Router();
const activateController = require("./controllers/activate-controller");
const authController = require("./controllers/auth-controller");
const authMiddlware = require("./middlewares/auth-middlware");

router.post("/api/send-otp", authController.sendOtp);
router.post("/api/verify-otp", authController.verifyOtp);
router.post("/api/activate", authMiddlware, activateController.activate);
router.get("/api/refresh", authController.refresh);

module.exports = router;
