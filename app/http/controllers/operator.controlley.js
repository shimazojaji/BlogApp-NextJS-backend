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


// Exports
module.exports = {
  getOperators,
  addOperator,
  removeOperator, updateOprator,getOperatorById
};
