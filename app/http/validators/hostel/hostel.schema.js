const Joi = require("joi");
const createHttpError = require("http-errors");

async function validateHostelSchema(data) {
  const HostelSchema = Joi.object({
    hostelName: Joi.string().min(3).max(100).required()
      .error(createHttpError.BadRequest("نام اسکان الزامی است و باید معتبر باشد")),
    address: Joi.string().min(3).max(100).required()
      .error(createHttpError.BadRequest("آدرس اسکان الزامی است و باید معتبر باشد")),


    capacity: Joi.number().integer().min(1).max(10000).required()
      .error(createHttpError.BadRequest("ظرفیت اسکان الزامی است و باید عددی معتبر باشد")),

    foodStatus: Joi.boolean.required()
      .error(createHttpError.BadRequest("وضعیت غذا باید بله یا خیر باشد")),
    isMedical: Joi.boolean().optional(),
    bathroomStatus: Joi.string().valid("yes", "no").required()
      .error(createHttpError.BadRequest("وضعیت حمام باید 'yes' یا 'no' باشد")),
  });

  return await HostelSchema.validateAsync(data);
}

module.exports = {
  validateHostelSchema,
};
