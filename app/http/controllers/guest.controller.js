const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { GuestModel } = require("../../models/guest");
const { addGuestSchema } = require("../validators/guest/guest.schema");
const mongoose = require("mongoose");


// Get list of guests
const getListOfGuests = async (req, res, next) => {
  try {
    const query = req.query;
    const guests = await GuestModel.find(query);

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        guests,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Add a new guest
const addNewGuest = async (req, res, next) => {
  try {
    await addGuestSchema.validateAsync(req.body);

    const { mobile } = req.body;
    const exists = await GuestModel.findOne({ mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلاً ثبت شده است");

    const guest = await GuestModel.create(req.body);

    
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "اطلاعات میزبان با موفقیت ثبت شد",
      data: guest,
    });
  } catch (err) {
    next(err);
  }
};



// Remove a guest
const removeGuest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await findGuestById(id);

    const guest = await GuestModel.findByIdAndDelete(id);
    if (!guest || !guest._id) {
      throw createHttpError.InternalServerError("زائر حذف نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "زائر با موفقیت حذف شد",
      },
    });
  } catch (err) {
    next(err);
  }
};

// Find guest by ID
const findGuestById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError.BadRequest("شناسه پست نامعتبر است");
  }

  const guest = await GuestModel.findById(id);
  if (!guest) {
    throw createHttpError.NotFound("زائر پیدا نشد");
  }

  return guest;
};

// Update guest
const updateGuest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await findGuestById(id);

    const data = { ...req.body };

    const updateResult = await GuestModel.updateOne(
      { _id: id },
      { $set: data }
    );

    if (!updateResult.modifiedCount) {
      throw new createHttpError.InternalServerError("به روزرسانی پست انجام نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی زائر با موفقیت انجام شد",
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get guest by ID
const getGuestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guest = await findGuestById(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: guest,
    });
  } catch (err) {
    next(err);
  }
};
// 
const getAllGuest= async (req, res, next) => {
  try {
    const all = await GuestModel.find().sort({ createdAt: -1 });
    res.json({ data: all });
  } catch (err) {
    next(err);
  }
}

// Exports
module.exports = {
  addNewGuest,
  getListOfGuests,
  getAllGuest,
  removeGuest,
  updateGuest,
  getGuestById,
};
