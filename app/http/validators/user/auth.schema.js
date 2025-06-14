const Joi = require("joi");
const createHttpError = require("http-errors");
async function validateSigninPrivateUserSchema(data) {
  const signinPrivateSchema = Joi.object({
    username: Joi.string()
      .required()
      .alphanum()
      .min(3)
      .max(30)
      .error(createHttpError.BadRequest("نام کاربری وارد شده صحیح نمی باشد")),
    password: Joi.string()
      .min(8)
      .required()
      .error(createHttpError.BadRequest("رمز عبور باید حداقل 8 کاراکتر باشد")),
  });
  return await signinPrivateSchema.validateAsync(data);
}

async function validateSigninPublicUserSchema(data) {
  const signinPublicSchema = Joi.object({
      mobile: Joi.string().pattern(/^09\d{9}$/).required().error(createHttpError.BadRequest(" موبایل را به درستی وارد کنید")),
    
    role: Joi.string()
     .valid("guest","host","server")
      .required()
      .error(createHttpError.BadRequest("  انتخاب نقش الزامی است    ")),
  });
  return await signinPublicSchema.validateAsync(data);
}
module.exports = {validateSigninPrivateUserSchema,validateSigninPublicUserSchema}