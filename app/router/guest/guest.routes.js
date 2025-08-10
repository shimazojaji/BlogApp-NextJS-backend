const express = require("express");
const router = express.Router();
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { addGuestSchema } = require("../../http/validators/guest/guest.schema");
const { GuestModel } = require("../../models/guest");
const { verifyAccessToken, decideAuthMiddleware } = require("../../http/middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const { removeGuest, updateGuest, getGuestById, changeStatus, servicedGuest, sendMessage, updatePrintGuest, setTimeGuest } = require("../../http/controllers/guest.controller");


// POST /guest/add - Create new entry
router.post("/add", async (req, res, next) => {
  try {
    await addGuestSchema.validateAsync(req.body);
    const { mobile, registerOperator, namefamily } = req.body;
  


    const exists = await GuestModel.findOne({ mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلا ثبت شده است");
    const guest = await GuestModel.create(req.body);

    try {
      //  ارسال پیامک فقط اگر ایجاد زائر موفق بود
      switch (registerOperator) {
        case "زائر":
        case "بهار":
        case "ادمین":
          // console.log(mobile,registerOperator)
          await sendMessage(mobile, namefamily);
          break;
        default:
          throw new Error("نوع اپراتور نامعتبر است");
      }
    } catch (smsError) {
      // می‌شود  اگر پیامک ارسال نشد، زائر  حذف 
      await GuestModel.findByIdAndDelete(guest._id);
      throw createHttpError.InternalServerError("ثبت اطلاعات انجام نشد، ارسال پیامک با خطا مواجه شد");
    }

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "ثبت اطلاعات با موفقیت انجام شد",
      data: guest,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/addLalejin", async (req, res, next) => {
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

router.patch("/updatePrint/:id", verifyAccessToken, expressAsyncHandler(updatePrintGuest));

router.patch("/setTime/:id", verifyAccessToken, expressAsyncHandler(setTimeGuest));

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
