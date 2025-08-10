const { NewsController } = require("../../http/controllers/news.controller");
const express = require("express");
const router = express.Router();
const expressAsyncHandler = require("express-async-handler");
const { uploadFile } = require("../../utils/multer");
const { verifyAccessToken, decideAuthMiddleware } = require("../../http/middlewares/auth.middleware");


router.post(
  "/create",
  verifyAccessToken,
  uploadFile.single("coverImage"),
  expressAsyncHandler(NewsController.addNewNews)
);
router.patch(
  "/update/:id",
  verifyAccessToken,
  uploadFile.single("coverImage"),
  expressAsyncHandler(NewsController.updateNews)
);
router.get(
  "/list",
  decideAuthMiddleware,
  expressAsyncHandler(NewsController.getAllNews)
);
router.delete(
  "/remove/:id",
  verifyAccessToken,
  expressAsyncHandler(NewsController.removeNews)
);
