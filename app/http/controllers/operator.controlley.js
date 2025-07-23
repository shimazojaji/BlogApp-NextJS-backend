const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const mongoose = require("mongoose");
const { OperatorModel } = require("../../models/user/operator");
const { validateFullOperatorSchema } = require("../validators/operator/operator.schema");


// Get list of perators
const getOperators = async (req, res, next) => {
  try {
    const query = req.query;
    const operators = await OperatorModel.find(query);

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        operators,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Add a new operator
const addOperator = async (req, res, next) => {
  try {
        await validateFullOperatorSchema(req.body)


    const { code } = req.body;
    const exists = await OperatorModel.findOne({ code });
    if (exists) throw createHttpError.Conflict("کد ملی  قبلاً ثبت شده است");

    const operator = await OperatorModel.create(req.body);


    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "اطلاعات اپراتور با موفقیت ثبت شد",
      data: operator,
    });
  } catch (err) {
    next(err);
  }
};



// Remove an operator
const removeOperator = async (req, res, next) => {
  try {
    const { id } = req.params;
    await findOperatorById(id);

    const operator = await OperatorModel.findByIdAndDelete(id);
    if (!operator || !operator._id) {
      throw createHttpError.InternalServerError("اپراتور حذف نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "اپراتور با موفقیت حذف شد",
      },
    });
  } catch (err) {
    next(err);
  }
};

// Find operator by ID
const findOperatorById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError.BadRequest("شناسه اپراتور نامعتبر است");
  }

  const operator = await OperatorModel.findById(id);
  if (!operator) {
    throw createHttpError.NotFound("اپراتور پیدا نشد");
  }

  return operator;
};

// Update operator
const updateOprator = async (req, res, next) => {
  try {
    const { id } = req.params;
    await findOperatorById(id);

    const data = { ...req.body };

    const updateResult = await OperatorModel.updateOne(
      { _id: id },
      { $set: data }
    );

    if (!updateResult.modifiedCount) {
      throw new createHttpError.InternalServerError("به روزرسانی اپراتور انجام نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی اپراتور با موفقیت انجام شد",
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get operator by ID
const getOperatorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const operator = await findOperatorById(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: operator,
    });
  } catch (err) {
    next(err);
  }
};
// کنترلر تغییر نام  اپراتور
const hostelChange = async (req, res, next) => {
  try {
    /* 1) پارامترها */
    const { id: operatorId } = req.params;
    const { hostelName } = req.body;          // فقط hostelName را می‌گیریم

    /* 2) اعتبارسنجی ورودی */
    if (!hostelName || typeof hostelName !== "string") {
      throw createHttpError.BadRequest("آدرس اسکان  معتبر نیست");
    }

    /* 3) بررسی وجود اپراتور */
    const operator = await OperatorModel.findById(operatorId);
    if (!operator) {
      throw createHttpError.NotFound("اپراتور یافت نشد");
    }

    /* 4) به‌روزرسانی */
    const { modifiedCount } = await OperatorModel.updateOne(
      { _id: operatorId },
      { $set: { hostelName } }
    );

    if (modifiedCount === 0) {
      throw createHttpError.BadRequest("عملیات ناموفق بود");
    }

    /* 5) پاسخ موفق */
    return res.status(200).json({
      statusCode: 200,
      data: { message: "اپراتور اسکان  با موفقیت به‌روزرسانی شد" },
    });
  } catch (err) {
    /* 6) ارسال خطا به middleware مرکزی خطاها */
    next(err);
  }
};


// Exports
module.exports = {
  getOperators,
  addOperator,
  removeOperator, updateOprator,getOperatorById,hostelChange
};
