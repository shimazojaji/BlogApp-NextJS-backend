const expressAsyncHandler = require("express-async-handler");
const { UserAuthController } = require("../../http/controllers/auth.controller");
const { verifyAccessToken } = require("../../http/middlewares/auth.middleware");
const router = require("express").Router();

router.post("/signinpv", expressAsyncHandler(UserAuthController.signinPrivateUser));

router.post("/signinpb", expressAsyncHandler(UserAuthController.signinPublicUser));

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
  "/list",
  verifyAccessToken,
  expressAsyncHandler(UserAuthController.getAllUsers)
);
router.post("/logout", expressAsyncHandler(UserAuthController.logout));

module.exports = router

