const Joi = require("joi");
const createHttpError = require("http-errors");

const addOperatorSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).lowercase().trim().required()
    .error(createHttpError.BadRequest("نام کاربری الزامی است و باید معتبر باشد")),

  password: Joi.string().min(6).max(100).required()
    .error(createHttpError.BadRequest("رمز عبور الزامی است و باید حداقل ۶ کاراکتر باشد")),

  mobile: Joi.string().pattern(/^09\d{9}$/).required()
    .error(createHttpError.BadRequest("شماره موبایل باید با فرمت صحیح وارد شود")),

  code: Joi.string().length(6).required() // assuming a 6-character unique code
    .error(createHttpError.BadRequest("کد الزامی است و باید شامل ۶ کاراکتر باشد")),

  role: Joi.string().valid("bahar", "lalejin", "phone","eskan","service","nazer","tadarok").required() // customize allowed roles
    .error(createHttpError.BadRequest("نقش کاربر نامعتبر است")),
});

module.exports = {
  addOperatorSchema,
};
