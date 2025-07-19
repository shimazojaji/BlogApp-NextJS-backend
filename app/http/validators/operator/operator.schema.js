const Joi = require("joi");
const createHttpError = require("http-errors");

async function validateFullOperatorSchema(data) {
  const Operatorschema = Joi.object({
    mobile: Joi.string().pattern(/^09\d{9}$/).required()
      .error(createHttpError.BadRequest("شماره موبایل باید با فرمت صحیح وارد شود")),

    code: Joi.string().pattern(/^3\d{9}$/).required()
      .error(createHttpError.BadRequest("کد ملی باید با فرمت صحیح وارد شود")),

    role: Joi.string().valid("bahar", "lalejin", "phone", "eskan", "service", "nazer", "tadarok").required()
      .error(createHttpError.BadRequest("نقش کاربر نامعتبر است")),
    name: Joi.string().min(5).max(100).required()
      .error(createHttpError.BadRequest("نام و نام خانوادگی را به درستی وارد کنید")),
    operatorStatus: Joi.string().optional(),
    // operatorOperation: Joi.array().items(Joi.string()).optional(),
    hostelName: Joi.string().optional()
  });

  return await Operatorschema.validateAsync(data);
}

async function validatePartialOperatorSchema(data) {
  const Operatorschema = Joi.object({
    mobile: Joi.string().pattern(/^09\d{9}$/).required()
      .error(createHttpError.BadRequest("نام کاربری   باید   صحیح وارد شود")),

    code: Joi.string().pattern(/^3\d{9}$/).required()
      .error(createHttpError.BadRequest("رمز عبور  باید   صحیح وارد شود")),
  });

  return await Operatorschema.validateAsync(data);
}

module.exports = {
  validateFullOperatorSchema,
  validatePartialOperatorSchema,
};
