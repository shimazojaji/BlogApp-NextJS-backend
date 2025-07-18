const createHttpError = require("http-errors");
const Joi = require("joi");

const addHostSchema = Joi.object({
  namefamily: Joi.string().min(5).max(100).required().messages({
    "string.base": "نام و نام خانوادگی باید یک رشته باشد",
    "string.min": "نام و نام خانوادگی باید حداقل ۵ کاراکتر باشد",
    "string.max": "نام و نام خانوادگی نباید بیش از ۱۰۰ کاراکتر باشد",
    "any.required": "نام و نام خانوادگی الزامی است",
  }),
  mobile: Joi.string().pattern(/^09\d{9}$/).required().messages({
    "string.pattern.base": "شماره موبایل صحیح نمی‌باشد",
    "any.required": "شماره موبایل الزامی است",
  }),
  maleNo: Joi.number().greater(-1).less(101).required()
    .error(createHttpError.BadRequest("تعداد نفرات آقا را به درستی وارد کنید")),

  femaleNo: Joi.number().greater(-1).less(101).required()
    .error(createHttpError.BadRequest("تعداد نفرات خانم را به درستی وارد کنید")),

  isFood: Joi.boolean().optional(),
  isMedical: Joi.boolean().optional(),
  isBath: Joi.boolean().optional(),
  address: Joi.string().min(5).max(100).required()
    .error(createHttpError.BadRequest("آدرس اسکان الزامی است و باید معتبر باشد")),
  startDate: Joi.date().iso().required().messages({
    "date.format": "تاریخ شروع باید به فرمت YYYY-MM-DD باشد",
    "any.required": "تاریخ شروع الزامی است",
  }),
  endDate: Joi.date().iso().required().messages({
    "date.format": "تاریخ پایان باید به فرمت YYYY-MM-DD باشد",
    "any.required": "تاریخ پایان الزامی است",
  }),
})
  .custom((obj, helpers) => {
    const start = new Date(obj.startDate);
    const end = new Date(obj.endDate);

    if (start >= end) {
      return helpers.error("any.invalid", {
        message: "تاریخ شروع باید قبل از تاریخ پایان باشد",
      });
    }
    return obj;
  })
  .messages({
    "any.invalid": "{{#message}}",
    "date.base": "تاریخ وارد شده معتبر نیست",
    "any.required": "تمام فیلدهای تاریخ الزامی هستند",
  });
;

module.exports = {
  addHostSchema,
};


