
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { ServerToguestModel } = require("../../models/serverToguest");
const { addServerSchema } = require("../validators/servertoguest/serverToguest.schema");
const { default: mongoose } = require("mongoose");
const Kavenegar = require("kavenegar");

/**
* List (server) entries 
*/
const getListOfServers = async (req, res, next) => {
  try {
    const query = req.query;


    const servers = await
      ServerToguestModel.find(query);

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        servers,
      },
    });
  } catch (err) {
    next(err);
  }
};
const addNewServer = async (req, res, next) => {
  try {
    await addServerSchema.validateAsync(req.body);

    const exists = await ServerToguestModel.findOne({ mobile: req.body.mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلاً ثبت شده است");

    const servers = await ServerToguestModel.create(req.body);

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "اطلاعات میزبان با موفقیت ثبت شد",
      data: servers,
    });
  } catch (err) {
    next(err);
  }
};
// Get host by ID
const getServerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const server = await findServerById(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: server,
    });
  } catch (err) {
    next(err);
  }
};

// Update server
const updateServer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await findServerById(id);

    const data = { ...req.body };

    const updateResult = await ServerToguestModel.updateOne(
      { _id: id },
      { $set: data }
    );

    if (!updateResult.modifiedCount) {
      throw new createHttpError.InternalServerError("به روزرسانی خادم انجام نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی خادم با موفقیت انجام شد",
      },
    });
  } catch (err) {
    next(err);
  }
};

// Remove  Server
const removeServer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await findServerById(id);

    const server = await ServerToguestModel.findByIdAndDelete(id);
    if (!server || !server._id) {
      throw createHttpError.InternalServerError("خادم حذف نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "خادم با موفقیت حذف شد",
      },
    });
  } catch (err) {
    next(err);
  }
};
const findServerById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError.BadRequest("شناسه خادم نامعتبر است");
  }

  const server = await ServerToguestModel.findById(id);
  if (!server) {
    throw createHttpError.NotFound("خادم پیدا نشد");
  }

  return server;
};
const sendMessage = async (mobile, namefamily) => {
  const sender = "9982003208";
  const receptor = mobile;
  let message = `خادم گرامی :${namefamily}\n ثبت‌‌‌نام شما در ضریح با موفقیت انجام شد.\n به‌زودی جهت هماهنگی‌های لازم با شما تماس گرفته خواهد شد.\n از همراهی ارزشمندتان سپاسگزاریم.\n |همه خادم باشیم|\n ستاد # مردمی اربعین لالجین`;

  if (!process.env.KAVENEGAR_API_KEY) {
    console.error("KAVENEGAR_API_KEY is not defined");
    return;
  }

  const api = Kavenegar.KavenegarApi({ apikey: process.env.KAVENEGAR_API_KEY });


  try {
    api.Send({
      message,
      sender,
      receptor
    }, function (response, status) {
      console.log("SMS Response:", response);
      console.log("SMS Status:", status);
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};
module.exports = {
  addNewServer,
  getListOfServers, getServerById, updateServer, removeServer, sendMessage
};
