
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { GuestModel } = require("../../models/guest");
const { addGuestSchema } = require("../validators/guest/guest.schema");
const { default: mongoose } = require("mongoose");

  //List (guest) entries 

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

const removeGuest = async(req,res)=>{
 
    const { id } = req.params;
    await findGuestById(id);
    const guest = await GuestModel.findByIdAndDelete(id);
    if (!guest._id) throw createHttpError.InternalServerError(" پست حذف نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "پست با موفقیت حذف شد",
      },
    });

  }
  const findGuestById= async(id) =>{
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest("شناسه پست نامعتبر است");
  }

  const updateGuest= async (req, res) =>{
    const { id } = req.params;
    const { namefamily, mobile, ...rest } = req.body;

    const guest = await this.findGuestById(id);
    const data = copyObject(rest);
   


  

    const updateGuestResult = await GuestModel.updateOne(
      { _id: id },
      
    );

    if (!updateGuestResult.modifiedCount)
      throw new createHttpError.InternalServerError(
        "به روزرسانی پست انجام نشد"
      );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی زائر با موفقیت انجام شد",
      },
    });
  }

  const  getGuestById=async(req, res) =>{
    const { id } = req.params;
    const guest = await findGuestById(id);
    
  }
module.exports = {
  addNewGuest,
  getListOfGuests,removeGuest,updateGuest,getGuestById
};
