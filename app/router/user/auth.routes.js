const expressAsyncHandler = require("express-async-handler");
const { UserAuthController } = require("../../http/controllers/auth.controller");
const { verifyAccessToken } = require("../../http/middlewares/auth.middleware");
const router = require("express").Router();
router.post("/get-otp", expressAsyncHandler(UserAuthController.getOtp));
router.post("/send-otp", expressAsyncHandler(UserAuthController.sendOtp));

// router.post("/signinpv", expressAsyncHandler(UserAuthController.signinPrivateUser));

router.post("/signinpb", expressAsyncHandler(UserAuthController.signinPublicUser));
router.post("/login", expressAsyncHandler(UserAuthController.login));

router.get(
  "/refresh-token",
  expressAsyncHandler(UserAuthController.refreshToken)
);


router.get(
  "/profilePv",
  verifyAccessToken,
  expressAsyncHandler(UserAuthController.getUserProfilePv)
);
router.get(
  "/profileGuest",
  verifyAccessToken,
  expressAsyncHandler(UserAuthController.getProfileGuest)
);
router.get(
  "/list",
  verifyAccessToken,
  expressAsyncHandler(UserAuthController.getAllUsers)
);
router.post("/logout", expressAsyncHandler(UserAuthController.logout));

module.exports = router

