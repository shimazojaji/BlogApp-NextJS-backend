const Joi = require("joi");
const createHttpError = require("http-errors");
async function validateAdminLoginSchema(data) {
const AdminSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).lowercase().trim().required()
    .error(createHttpError.BadRequest("نام کاربری الزامی است و باید معتبر باشد")),

  password: Joi.string().min(8).max(100).required()
    .error(createHttpError.BadRequest("رمز عبور الزامی است و باید حداقل ۶ کاراکتر باشد")),

  
});
;
  return await AdminSchema.validateAsync(data);
}
module.exports = {
  validateAdminLoginSchema
};
