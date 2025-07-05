const createHttpError = require("http-errors");
const Joi = require("joi");

const addGuestSchema = Joi.object({
  namefamily: Joi.string().min(5).max(100).required()
    .error(createHttpError.BadRequest("نام و نام خانوادگی را به درستی وارد کنید")),
    
  mobile: Joi.string().pattern(/^09\d{9}$/).required()
    .error(createHttpError.BadRequest("موبایل را به درستی وارد کنید")),

  maleNo: Joi.number().greater(-1).less(101).required()
    .error(createHttpError.BadRequest("تعداد نفرات آقا را به درستی وارد کنید")),

  femaleNo: Joi.number().greater(-1).less(101).required()
    .error(createHttpError.BadRequest("تعداد نفرات خانم را به درستی وارد کنید")),

  childNo: Joi.number().greater(-1).less(101).required()
    .error(createHttpError.BadRequest("تعداد کودکان را به درستی وارد کنید")),

  city: Joi.string().required()
    .error(createHttpError.BadRequest("شهر را به درستی وارد کنید")),

  startDate: Joi.date().iso().required()
    .error(createHttpError.BadRequest("تاریخ را به درستی وارد کنید")),

  // Optional fields (validate type only if provided)
  status: Joi.string().valid("isPending", "approved", "rejected","accepted","accepting","entered","exited").optional(),

  hostel: Joi.string().optional(),

  isNeedDrug: Joi.boolean().optional(),
  isNeedMedicine: Joi.boolean().optional(),
  isNeedFood: Joi.boolean().optional(),
  isNeedSpecialServices: Joi.boolean().optional(),
  isNeedShower: Joi.boolean().optional(),
    isServiced: Joi.boolean().optional(),

});

  
module.exports = {
  addGuestSchema,
};




