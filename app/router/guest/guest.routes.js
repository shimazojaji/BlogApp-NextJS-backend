const express = require("express");
const router = express.Router();
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { addGuestSchema } = require("../../http/validators/guest/guest.schema");
const { GuestModel } = require("../../models/guest");
const { verifyAccessToken, decideAuthMiddleware } = require("../../http/middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const { removeGuest, updateGuest, getGuestById, changeStatus, servicedGuest } = require("../../http/controllers/guest.controller");


// POST /guest/add - Create new entry
router.post("/add", async (req, res, next) => {
  try {
    await addGuestSchema.validateAsync(req.body);

    const { mobile } = req.body;

    const exists = await GuestModel.findOne({ mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلا ثبت شده است");
    const guest = await GuestModel.create(req.body);



    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
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

// Remove, update, get by ID
router.delete("/remove/:id", verifyAccessToken, expressAsyncHandler(removeGuest));
router.patch("/update/:id", verifyAccessToken, expressAsyncHandler(updateGuest));
router.get("/:id", decideAuthMiddleware, expressAsyncHandler(getGuestById));
router.post(
  "/status/:id",
  verifyAccessToken,
  expressAsyncHandler(changeStatus)
);
router.post(
  "/service/:id",
  verifyAccessToken,
  expressAsyncHandler(servicedGuest)
);
module.exports = router;
