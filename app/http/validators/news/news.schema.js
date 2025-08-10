const Joi = require("joi");
const createHttpError = require("http-errors");
const {  } = require("../../../utils/constants");

async function validateAddNewPost(data) {
  const addNewNewsSchema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(100)
      .required()
      .error(createHttpError.BadRequest("عنوان پست را به درستی وارد کنید")),
    
    text: Joi.string()
      .required()
      .error(createHttpError.BadRequest(" متن پست را به درستی وارد کنید")),
    
  });
  return addNewNewsSchema.validateAsync(data);
}

module.exports = {
  addNewNewsSchema,
};
