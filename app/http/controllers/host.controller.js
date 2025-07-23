const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { HostModel } = require("../../models/host");
const { addHostSchema } = require("../validators/host/host.schema");
const { default: mongoose } = require("mongoose");
// const dbConnect=require("../../lib/dbconnect")
/**
 * دریافت لیست همه میزبان‌ها با امکان فیلتر کردن
 */
const getListOfHosts = async (req, res, next) => {
  try {
    const query = req.query;
    const hosts = await HostModel.find(query);
    res.json({
      data: { hosts },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * افزودن میزبان جدید
 */
const addNewHost = async (req, res, next) => {
  try {
    await addHostSchema.validateAsync(req.body);

    const exists = await HostModel.findOne({ mobile: req.body.mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلاً ثبت شده است");

    const host = await HostModel.create(req.body);

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "اطلاعات میزبان با موفقیت ثبت شد",
      data: host,
    });
  } catch (err) {
    next(err);
  }
};
const removeHost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await findHostById(id);

    const host = await HostModel.findByIdAndDelete(id);
    if (!host || !host._id) {
      throw createHttpError.InternalServerError("میزبان حذف نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "میزبان با موفقیت حذف شد",
      },
    });
  } catch (err) {
    next(err);
  }
};

const findHostById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError.BadRequest("شناسه میزبان نامعتبر است");
  }

  const host = await HostModel.findById(id);
  if (!host) {
    throw createHttpError.NotFound("میزبان پیدا نشد");
  }

  return host;
};

/**
 * دریافت لیست میزبان‌هایی که هنوز هاستلی به آن‌ها اختصاص داده نشده
 */
// const getAvailableHosts = async (req, res, next) => {
//   try {
//     await dbConnect();

//     const hosts = await HostModel.find();
//     const hostels = await HostelModel.find({}, "host");
//     const usedHostIds = hostels.map(h => h.host?.toString());

//     const availableHosts = hosts.filter(
//       h => !usedHostIds.includes(h._id.toString())
//     );

//     res.status(200).json({
//       statusCode: HttpStatus.OK,
//       message: "میزبان‌های آزاد دریافت شدند",
//       data: availableHosts,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
const decreaseGuestNo = async (req, res, next) => {
  // await addHostSchema.validateAsync(req.body);
  const { id } = req.params;
  // console.log(req.body)
  // const amount = parseInt(req.body.amount, 10);
 const  maleNo = parseInt(req.body.maleNo, 10);
  const  femaleNo  = parseInt(req.body.femaleNo, 10);
  console.log(maleNo, femaleNo)
  if (isNaN(maleNo) || isNaN(femaleNo)) {
    return res.status(400).json({ message: "مقدار وارد شده نامعتبر است" });
  }

  try {
    const result = await HostModel.updateOne(
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
// Update host
const updateHost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await findHostById(id);

    const data = { ...req.body };

    const updateResult = await HostModel.updateOne(
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


// Get host by ID
const getHostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const host = await findHostById(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: host,
    });
  } catch (err) {
    next(err);
  }
};
const foodService = async (req, res) => {
  const { id: hostId } = req.params;

  const host = await HostModel.findById(hostId);

  if (!host) {
    throw createHttpError.NotFound("اسکان خصوصی یافت نشد");
  }

  // برعکس کردن وضعیت
  const newStatus = !host.isFood;

  const hostUpdate = await HostModel.updateOne(
    { _id: hostId },
    {
      $set: {
        isFood: newStatus,
        statusChangedAt: new Date(),
      },
    }
  );

  if (hostUpdate.modifiedCount === 0) {
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
  const { id: hostId } = req.params;

  const host = await HostModel.findById(hostId);

  if (!host) {
    throw createHttpError.NotFound("اسکان خصوصی یافت نشد");
  }

  // برعکس کردن وضعیت
  const newStatus = !host.isMedical;

  const hostUpdate = await HostModel.updateOne(
    { _id: hostId },
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
module.exports = {
  addNewHost,
  getListOfHosts, removeHost, decreaseGuestNo, updateHost, getHostById, foodService, medicalService,findHostById
};
