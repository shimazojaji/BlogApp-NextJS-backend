const createHttpError = require("http-errors");
const Joi = require("joi");

const addServerSchema = Joi.object({
  namefamily: Joi.string().min(5).max(100).required().messages({
    "string.base": "نام و نام خانوادگی باید یک رشته باشد",
    "string.min": "نام و نام خانوادگی باید حداقل ۵ کاراکتر باشد",
    "string.max": "نام و نام خانوادگی نباید بیش از ۱۰۰ کاراکتر باشد",
    "any.required": "نام و نام خانوادگی الزامی است",
  }),
  mobile: Joi.string().pattern(/^09\d{9}$/).required().error(createHttpError.BadRequest(" موبایل را به درستی وارد کنید")),


  serverSkill: Joi.string()
    .required()
    .error(createHttpError.BadRequest("   مهارت تخصصی را به درستی وارد کنید")),

  gender: Joi.string()
    .required()
    .error(createHttpError.BadRequest("  جنسیت   را به درستی مشخص کنید")),
  serverHistory: Joi.string()
    .required()
    .error(createHttpError.BadRequest("    سابقه خدمت  را   مشخص کنید")),
  birthDate: Joi.date().iso().required()
    .error(createHttpError.BadRequest("تاریخ را به درستی وارد کنید")),
    category:Joi.array().items(Joi.string()).required()

})


module.exports = {
  addServerSchema,
};




