const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const { addGuestSchema } = require("../../http/validators/guest/guest.schema");
const { GuestModel } = require("../../models/guest");
const { verifyAccessToken, decideAuthMiddleware } = require("../../http/middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const { removeGuest, updateGuest, getGuestById } = require("../../http/controllers/guest.controller");


// POST /guest/add - Create new entry
router.post("/add", async (req, res, next) => {
  try {
    await addGuestSchema.validateAsync(req.body);

    const exists = await GuestModel.findOne({ mobile: req.body.mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلا ثبت شده است");

    const guest = await GuestModel.create(req.body);
    res.status(201).json({
      message: "ثبت اطلاعات با موفقیت انجام شد",
      data: guest,
    });
  } catch (err) {
    next(err);
  }
});

// GET /guest/list - List all entries
router.get("/list", async (req, res, next) => {
  try {
    const all = await GuestModel.find().sort({ createdAt: -1 });

    res.json({ data: all });
  } catch (err) {
    next(err);
  }
});
router.delete(
  "/remove/:id",
  verifyAccessToken,
  expressAsyncHandler(removeGuest)
);
router.patch(
  "/update/:id",
  verifyAccessToken,
  expressAsyncHandler(updateGuest)
);
router.get(
  "/:id",
  decideAuthMiddleware,
  expressAsyncHandler(getGuestById)
);
router.patch(
  "/update/:id",
  verifyAccessToken,
  expressAsyncHandler(updateGuest)
);
module.exports = router;
