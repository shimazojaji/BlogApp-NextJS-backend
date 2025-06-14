const createHttpError = require("http-errors");
const Joi = require("joi");

const addServerSchema = Joi.object({
    namefamily: Joi.string().min(5).max(100).required().error(createHttpError.BadRequest(" نام و نام خانوادگی را به درستی وارد کنید")),

    mobile: Joi.string().pattern(/^09\d{9}$/).required().error(createHttpError.BadRequest(" موبایل را به درستی وارد کنید")),


    serverSkill: Joi.string()
        .required()
        .error(createHttpError.BadRequest("   مهارت تخصصی را به درستی وارد کنید")),

    serverFavorite: Joi.string()
        .required()
        .error(createHttpError.BadRequest("  مهارت مورد علاقه را به درستی مشخص کنید")),
    serverTime: Joi.string()
        .required()
        .error(createHttpError.BadRequest("  مدت زمان خدمت را به درستی مشخص کنید")),

})


module.exports = {
    addServerSchema,
};




