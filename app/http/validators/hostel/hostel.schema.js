const Joi = require("joi");
const createHttpError = require("http-errors");

async function validateHostelSchema(data) {
  const HostelSchema = Joi.object({
    hostelName: Joi.string().min(3).max(100).required()
      .error(createHttpError.BadRequest("نام اسکان الزامی است و باید معتبر باشد")),
    address: Joi.string().min(3).max(100).required()
      .error(createHttpError.BadRequest("آدرس اسکان الزامی است و باید معتبر باشد")),
    maleNo: Joi.number().greater(-1).less(101).required()
      .error(createHttpError.BadRequest("تعداد نفرات آقا را به درستی وارد کنید")),

    femaleNo: Joi.number().greater(-1).less(101).required()
      .error(createHttpError.BadRequest("تعداد نفرات خانم را به درستی وارد کنید")),

    /*   capacity: Joi.number().integer().min(1).max(10000).required()
        .error(createHttpError.BadRequest("ظرفیت اسکان الزامی است و باید عددی معتبر باشد")), */

    foodStatus: Joi.boolean().optional()
      .error(createHttpError.BadRequest("وضعیت غذا باید بله یا خیر باشد")),
    isMedical: Joi.boolean().optional(),
    operatorId: Joi.string().required()
      .error(createHttpError.BadRequest("نام اپراتور اسکان الزامی است    ")),
    bathroomStatus: Joi.boolean().optional(),
  });

  return await HostelSchema.validateAsync(data);
}

module.exports = {
  validateHostelSchema,
};
