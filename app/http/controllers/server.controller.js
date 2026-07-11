const { ServerToguestModel } = require("../../models/serverToguest");
const { addServerSchema } = require("../validators/servertoguest/serverToguest.schema");
const { StatusCodes: HttpStatus } = require("http-status-codes");

const createHttpError = require("http-errors");
const path = require("path");
const { sendMessage } = require("./serverToguest.controller");



const addNewServerToGuest = async (req, res, next) => {

    try {
        // await addServerSchema.validateAsync(req.body);
        const { filename, fileUploadPath, ...rest } = req.body;
        console.log(rest)
        let photo = "";
        await addServerSchema.validateAsync(rest);
        const {
            mobile,
            namefamily,
            serverSkill,
            gender,
            category, serverHistory,
            birthDate,

        } = rest;
        await addServerSchema.validateAsync(rest);

        const exists = await ServerToguestModel.findOne({ mobile: req.body.mobile });
        if (exists) throw createHttpError.Conflict("شماره موبایل قبلا ثبت شده است");
        /*  if (!fileUploadPath || !filename)
             throw createHttpError.InternalServerError("عکس پرسنلی  را اپلود کنید"); */
        /*     if (!req.file) {
                throw createHttpError.BadRequest("عکس پرسنلی را آپلود کنید");
            } */
        if (req.file) {
            photo = req.file.path.replace(/\\/g, "/");
        }


        /*   const fileAddress = path.join(fileUploadPath, filename);
          const photo = fileAddress.replace(/\\/g, "/"); */
        const server = await ServerToguestModel.create({
            mobile,
            namefamily,
            serverSkill,
            gender,
            serverHistory,
            birthDate,
            category,
            photo,
        });

        await sendMessage(mobile, namefamily)
        res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            message: "ثبت اطلاعات با موفقیت انجام شد",
            data: server,
        });


    } catch (err) {
        next(err);
    }
};
module.exports = {
    addNewServerToGuest
}