const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const mongoose = require("mongoose");
const { HostelModel } = require("../../models/hostel");
const { validateHostelSchema } = require("../validators/hostel/hostel.schema");


// Get list of perators
const getHostels = async (req, res, next) => {
  try {
    const query = req.query;
    const hostels = await HostelModel.find(query);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        hostels,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Add a new operator
const addHostel = async (req, res, next) => {
  try {
    await validateHostelSchema(req.body)


    const { hostelName } = req.body;
    const exists = await HostelModel.findOne({ hostelName });
    if (exists) throw createHttpError.Conflict("این اسکان قبلاً ثبت شده است");

    const hostel = await HostelModel.create(req.body);


    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "اطلاعات اسکان با موفقیت ثبت شد",
      data: hostel,
    });
  } catch (err) {
    next(err);
  }
};



// Remove an hostel
const removeHostel = async (req, res, next) => {
  try {
    const { id } = req.params;
    await findHostelById(id);

    const hostel = await HostelModel.findByIdAndDelete(id);
    if (!hostel || !hostel._id) {
      throw createHttpError.InternalServerError("اسکان حذف نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "اسکان با موفقیت حذف شد",
      },
    });
  } catch (err) {
    next(err);
  }
};

// Find hostel by ID
const findHostelById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError.BadRequest("شناسه اسکان نامعتبر است");
  }

  const hostel = await HostelModel.findById(id);
  if (!hostel) {
    throw createHttpError.NotFound("اسکان پیدا نشد");
  }

  return hostel;
};

// Update hostel
const updateHostel = async (req, res, next) => {
  try {
    const { id } = req.params;
    await findHostelById(id);

    const data = { ...req.body };

    const updateResult = await HostelModel.updateOne(
      { _id: id },
      { $set: data }
    );

    if (!updateResult.modifiedCount) {
      throw new createHttpError.InternalServerError("به روزرسانی اسکان انجام نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی اسکان با موفقیت انجام شد",
      },
    });
  } catch (err) {
    next(err);
  }
};

// Decrease capacity
// POST body: { id: string, amount: number }
const decreaseCapacity = async (req, res, next) => {
  const { id } = req.params;
  // const amount = parseInt(req.body.amount, 10);
  const maleNo = parseInt(req.body.maleNo, 10);
  const femaleNo = parseInt(req.body.femaleNo, 10);
  // console.log(maleNo, femaleNo)
  if (isNaN(maleNo) || isNaN(femaleNo)) {
    return res.status(400).json({ message: "مقدار وارد شده نامعتبر است" });
  }

  try {
    const result = await HostelModel.updateOne(
      { _id: id },
      { $inc: { maleNo: -maleNo } },
      { $inc: { femaleNo: -femaleNo } }

    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "اسکان یافت نشد" });
    }

    return res.status(200).json({
      message: "ظرفیت با موفقیت کاهش یافت",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


// Get hostel by ID
const getHostelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hostel = await findHostelById(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: hostel,
    });
  } catch (err) {
    next(err);
  }
};
const foodService = async (req, res) => {
  const { id: hostelId } = req.params;

  const hostel = await HostelModel.findById(hostelId);

  if (!hostel) {
    throw createHttpError.NotFound("اسکان عمومی یافت نشد");
  }

  // برعکس کردن وضعیت
  const newStatus = !hostel.foodStatus;
  console.log(newStatus)
  const hostelUpdate = await HostelModel.updateOne(
    { _id: hostelId },
    {
      $set: {
        foodStatus: newStatus,
        statusChangedAt: new Date(),
      },
    }
  );

  if (hostelUpdate.modifiedCount === 0) {
    throw createHttpError.BadRequest("عملیات ناموفق بود.");
  }

  const message = newStatus
    ? "غذا موجود  شد"
    : "  موجودی غذا تمام شد";

  return res.status(200).json({
    statusCode: 200,
    data: { message },
  });
};

const medicalService = async (req, res) => {
  const { id: hostelId } = req.params;

  const hostel = await HostelModel.findById(hostelId);

  if (!hostel) {
    throw createHttpError.NotFound("اسکان عمومی یافت نشد");
  }

  // برعکس کردن وضعیت
  const newStatus = !hostel.isMedical;

  const hostUpdate = await HostelModel.updateOne(
    { _id: hostelId },
    {
      $set: {
        isMedical: newStatus,
      },
    }
  );

  if (hostUpdate.modifiedCount === 0) {
    throw createHttpError.BadRequest("عملیات ناموفق بود.");
  }

  const message = newStatus
    ? "خدمات پزشکی موجود  شد"
    : "     خدمات پزشکی موجود نیست";

  return res.status(200).json({
    statusCode: 200,
    data: { message },
  });
};
// Exports
module.exports = {
  getHostels, addHostel, removeHostel, updateHostel, getHostelById, decreaseCapacity, foodService, medicalService, findHostelById
}
