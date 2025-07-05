const Joi = require("joi");
const createHttpError = require("http-errors");

const addHostelSchema = Joi.object({
  hostelName: Joi.string().min(3).max(100).required()
    .error(createHttpError.BadRequest("نام خوابگاه الزامی است و باید معتبر باشد")),

  hostelType: Joi.string().valid("private", "public").required()
    .error(createHttpError.BadRequest("نوع خوابگاه باید 'private' یا 'public' باشد")),

  capacity: Joi.number().integer().min(1).max(10000).required()
    .error(createHttpError.BadRequest("ظرفیت خوابگاه الزامی است و باید عددی معتبر باشد")),

  foodStatus: Joi.string().valid("yes", "no").required()
    .error(createHttpError.BadRequest("وضعیت غذا باید 'yes' یا 'no' باشد")),

  bathroomStatus: Joi.string().valid("yes", "no").required()
    .error(createHttpError.BadRequest("وضعیت حمام باید 'yes' یا 'no' باشد")),
});

module.exports = {
  addHostelSchema,
};
