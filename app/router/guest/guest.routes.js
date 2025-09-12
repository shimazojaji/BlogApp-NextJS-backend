const express = require("express");
const router = express.Router();
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { addGuestSchema } = require("../../http/validators/guest/guest.schema");
const { GuestModel } = require("../../models/guest");
const { verifyAccessToken, decideAuthMiddleware } = require("../../http/middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const { removeGuest, updateGuest, getGuestById, changeStatus, servicedGuest, sendMessage, updatePrintGuest, setTimeGuest, updateGuestTel } = require("../../http/controllers/guest.controller");
const { HostelModel } = require("../../models/hostel");
const { HostModel } = require("../../models/host");
const { default: mongoose } = require("mongoose");


// POST /guest/add - Create new entry
router.post("/add", async (req, res, next) => {
  try {
    await addGuestSchema.validateAsync(req.body);
    const { mobile, registerOperator, namefamily } = req.body;
  


    const exists = await GuestModel.findOne({ mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلا ثبت شده است");
    const guest = await GuestModel.create(req.body);

    // این قسمت برای ارسال پیامک فعال شده و فعلا چون نمی خواهیم پیامک ارسال شود غیر فعال شده
  /*   try {
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
    } */

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

    const {
      mobile,
      host,
      hostel,
      maleNo,
      femaleNo,
      childNo
    } = req.body;

    //  بررسی تکراری نبودن شماره موبایل
    const exists = await GuestModel.findOne({ mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلا ثبت شده است");

    //  انتخاب مدل ظرفیت بر اساس نوع مکان
    let CapacityModel;
    let placeId;
    if (hostel && hostel !== "unknown") {
      CapacityModel = HostelModel;
      placeId = hostel;
    } else if (host && host !== "unknown") {
      CapacityModel = HostModel;
      placeId = host;
    } else {
      throw createHttpError.BadRequest("نوع محل اقامت معتبر نیست");
    }

    // ۱. کاهش ظرفیت با شرط اتمیک
    const updatedPlace = await CapacityModel.findOneAndUpdate(
      {
        _id: placeId,
        remainMaleNo: { $gte: maleNo },
        remainFemaleNo: { $gte: femaleNo + childNo }
      },
      {
        $inc: {
          remainMaleNo: -maleNo,
          remainFemaleNo: -(femaleNo + childNo)
        }
      },
      { new: true }
    );

    if (!updatedPlace) {
      throw createHttpError.BadRequest("ظرفیت کافی وجود ندارد");
    }

    // ۲. ثبت مهمان
    let guest;
    try {
      guest = await GuestModel.create(req.body);
    } catch (err) {
      // اگر ثبت مهمان شکست خورد ظرفیت رو برگردون (rollback دستی)
      await CapacityModel.updateOne(
        { _id: placeId },
        {
          $inc: {
            remainMaleNo: maleNo,
            remainFemaleNo: femaleNo + childNo
          }
        }
      );
            await GuestModel.findByIdAndDelete(guest._id);

      throw err;
    }

    // پاسخ موفقیت
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "ثبت اطلاعات و بروزرسانی ظرفیت با موفقیت انجام شد",
      data: {
        guest,
        remainMaleNo: updatedPlace.remainMaleNo,
        remainFemaleNo: updatedPlace.remainFemaleNo
      }
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
router.patch("/updateTel/:id", verifyAccessToken, expressAsyncHandler(updateGuestTel));


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
