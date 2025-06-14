
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { GuestModel } = require("../../models/guest");
const { addGuestSchema } = require("../validators/guest/guest.schema");

  /**
 * List (guest) entries 
 */
const getListOfGuests = async (req, res, next) => {
  try {
    const query = req.query;


    const guests = await Promise.all([
      GuestModel.find(query),
    ]);

    res.json({
      date:{
        guests,
      }
    });
  } catch (err) {
    next(err);
  }
};
const addNewGuest = async (req, res, next) => {
  try {
    console.log("BODY RECEIVED:", req.body); 
    await addGuestSchema.validateAsync(req.body);

    const exists = await GuestModel.findOne({ mobile: req.body.mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلاً ثبت شده است");

    const guests = await GuestModel.create(req.body);

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "اطلاعات میزبان با موفقیت ثبت شد",
      data: guests,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  addNewGuest,
  getListOfGuests,
};
