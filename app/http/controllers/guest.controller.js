const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { GuestModel } = require("../../models/guest");
const { addGuestSchema } = require("../validators/guest/guest.schema");
const mongoose = require("mongoose");


// Get list of guests
const getListOfGuests = async (req, res, next) => {
  try {
    const query = req.query;
    const guests = await GuestModel.find(query);

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        guests,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Add a new guest
const addNewGuest = async (req, res, next) => {
  try {
    await addGuestSchema.validateAsync(req.body);

    const { mobile } = req.body;
    const exists = await GuestModel.findOne({ mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلاً ثبت شده است");

    const guest = await GuestModel.create(req.body);

    
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "اطلاعات میزبان با موفقیت ثبت شد",
      data: guest,
    });
  } catch (err) {
    next(err);
  }
};



// Remove a guest
const removeGuest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await findGuestById(id);

    const guest = await GuestModel.findByIdAndDelete(id);
    if (!guest || !guest._id) {
      throw createHttpError.InternalServerError("زائر حذف نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "زائر با موفقیت حذف شد",
      },
    });
  } catch (err) {
    next(err);
  }
};

// Find guest by ID
const findGuestById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError.BadRequest("شناسه پست نامعتبر است");
  }

  const guest = await GuestModel.findById(id);
  if (!guest) {
    throw createHttpError.NotFound("زائر پیدا نشد");
  }

  return guest;
};

// Update guest
const updateGuest = async (req, res, next) => {
  // console.log("📥 req.body:", req.body);

  try {
    const { id } = req.params;
    await findGuestById(id);

    const data = { ...req.body };

    const updateResult = await GuestModel.updateOne(
      { _id: id },
      { $set: data },       { new: true }
    );

    if (!updateResult.modifiedCount) {
      throw new createHttpError.InternalServerError("به روزرسانی پست انجام نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی زائر با موفقیت انجام شد",
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get guest by ID
const getGuestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guest = await findGuestById(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: guest,
    });
  } catch (err) {
    next(err);
  }
};
// 
const getAllGuest= async (req, res, next) => {
  try {
    const all = await GuestModel.find().sort({ createdAt: -1 });
    res.json({ data: all });
  } catch (err) {
    next(err);
  }
}


// const changeStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
// const { status } = req.body
//     // ✅ بررسی اولیه
//     if (!id || !status)
//       return res.status(400).json({ message: "شناسه یا وضعیت ناقص است." });

//     // ✅ بررسی وجود مهمان
//     const guest = await GuestModel.findById(id);
//     if (!guest)
//       return res.status(404).json({ message: "زائر پیدا نشد." });

//     // ✅ بروزرسانی وضعیت
//     guest.status = status;
//     await guest.save();

//     return res.status(200).json({
//       message: `وضعیت زائر با موفقیت به '${status}' تغییر یافت.`,
//       data: guest,
//     });
//   } catch (error) {
//     console.error("❌ خطا در تغییر وضعیت:", error);
//     return res
//       .status(500)
//       .json({ message: "خطا در تغییر وضعیت زائر", error: error.message });
//   }
// };

const changeStatus=async(req, res) =>{
  const { id: guestId } = req.params;

  // مرحله‌ای: accepted -> entered -> exited
  const statusFlow = ["accepted", "entered", "exited"];

  // پیدا کردن مهمان
  const guest = await GuestModel.findById(guestId);
  if (!guest) {
    return res.status(404).json({
      message: "زائر پیدا نشد",
    });
  }

  const currentStatusIndex = statusFlow.indexOf(guest.status);

  if (currentStatusIndex === -1) {
    return res.status(400).json({
      message: "وضعیت فعلی زائر نامعتبر است.",
    });
  }

  // اگر در آخرین وضعیت است (exited)، تغییر نده
  if (currentStatusIndex === statusFlow.length - 1) {
    return res.status(400).json({
      message: "وضعیت نهایی قبلاً ثبت شده است.",
    });
  }

  // تعیین وضعیت بعدی
  const nextStatus = statusFlow[currentStatusIndex + 1];

  // بروزرسانی در دیتابیس
  const updateResult = await GuestModel.updateOne(
    { _id: guestId },
    { $set: { status: nextStatus } }
  );

  if (updateResult.modifiedCount === 0) {
    throw createHttpError.BadRequest("عملیات تغییر وضعیت ناموفق بود.");
  }

  return res.status(200).json({
    statusCode: 200,
    data: {
      message: `وضعیت زائر به '${nextStatus}' تغییر یافت.`,
      guest: guest,
    },
  });
}

const servicedGuest = async (req, res) => {
  const { id: guestId } = req.params;

  const guest = await GuestModel.findById(guestId);

  if (!guest) {
    throw createHttpError.NotFound("زائر یافت نشد");
  }

  // برعکس کردن وضعیت
  const newStatus = !guest.isServiced;

  const guestUpdate = await GuestModel.updateOne(
    { _id: guestId },
    {
      $set: {
        isServiced: newStatus,
        statusChangedAt: new Date(),
      },
    }
  );

  if (guestUpdate.modifiedCount === 0) {
    throw createHttpError.BadRequest("عملیات ناموفق بود.");
  }

  const message = newStatus
    ? "خدمات انجام شد"
    : "خدمات لغو شد";

  return res.status(200).json({
    statusCode: 200,
    data: { message },
  });
};

// Exports
module.exports = {
  addNewGuest,
  getListOfGuests,
  getAllGuest,
  removeGuest,
  updateGuest,
  getGuestById,
  changeStatus,servicedGuest
};
