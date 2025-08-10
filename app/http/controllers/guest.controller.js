const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { GuestModel } = require("../../models/guest");
const { addGuestSchema } = require("../validators/guest/guest.schema");
const mongoose = require("mongoose");

const Kavenegar = require("kavenegar");
const { findHostelById } = require("./hostel.controller");
const { findHostById } = require("./host.controller");
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
  console.log(req.body)
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
    throw createHttpError.BadRequest(" شناسه زائر نا معتبر است   ");
  }

  const guest = await GuestModel.findById(id);
  if (!guest) {
    throw createHttpError.NotFound("زائر پیدا نشد");
  }

  return guest;
};

// Update guest
const updateGuest = async (req, res, next) => {
  // console.log("📥 req.body:", req.body);

  try {
    const { id } = req.params;
    await findGuestById(id);
    // const { mobile, namefamily, operatorName, hostel, host, eskanType } = req.body;
    // console.log(operatorName.at(-1))
    const data = { ...req.body };

    const updateResult = await GuestModel.updateOne(
      { _id: id },
      { $set: data }, { new: true }
    );

    if (!updateResult.modifiedCount) {
      throw new createHttpError.InternalServerError("به روزرسانی  انجام نشد");
    }
    // await sendMessage(mobile, namefamily, operatorName.at(-1), hostel, host, eskanType)


    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی  با موفقیت انجام شد",
      },
    });
  } catch (err) {
    next(err);
  }
};


// Update while printing
const updatePrintGuest = async (req, res, next) => {

  try {
    const { id } = req.params;
    const { mobile, namefamily, hostel, host, eskanType } = req.body;

    await findGuestById(id);
    const data = { ...req.body };

    const updateResult = await GuestModel.updateOne(
      { _id: id },
      { $set: data }, { new: true }
    );

    if (!updateResult.modifiedCount) {
      throw new createHttpError.InternalServerError("به روزرسانی  انجام نشد");
    }
          await sendMessagePrint(mobile, namefamily,  hostel, host, eskanType);


    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی  با موفقیت انجام شد",
      },
    });
  } catch (err) {
    next(err);
  }
};

// set arrival time 
const setTimeGuest = async (req, res, next) => {

  try {
    const { id } = req.params;
    await findGuestById(id);
    const { iso } = { ...req.body };
    // console.log(iso)
    const updateResult = await GuestModel.updateOne(
      { _id: id },
      { $set: { arrivalTime: iso } }

    );

    if (!updateResult.modifiedCount) {
      throw new createHttpError.InternalServerError("به روزرسانی  انجام نشد");
    }


    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی  با موفقیت انجام شد",
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
const getAllGuest = async (req, res, next) => {
  try {
    const all = await GuestModel.find().sort({ createdAt: -1 });
    res.json({ data: all });
  } catch (err) {
    next(err);
  }
}


// const changeStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
// const { status } = req.body
//     // ✅ بررسی اولیه
//     if (!id || !status)
//       return res.status(400).json({ message: "شناسه یا وضعیت ناقص است." });

//     // ✅ بررسی وجود مهمان
//     const guest = await GuestModel.findById(id);
//     if (!guest)
//       return res.status(404).json({ message: "زائر پیدا نشد." });

//     // ✅ بروزرسانی وضعیت
//     guest.status = status;
//     await guest.save();

//     return res.status(200).json({
//       message: `وضعیت زائر با موفقیت به '${status}' تغییر یافت.`,
//       data: guest,
//     });
//   } catch (error) {
//     console.error("❌ خطا در تغییر وضعیت:", error);
//     return res
//       .status(500)
//       .json({ message: "خطا در تغییر وضعیت زائر", error: error.message });
//   }
// };

const changeStatus = async (req, res) => {
  const { id: guestId } = req.params;

  // مرحله‌ای: inWay -> entered -> exited
  const statusFlow = ["inWay", "entered", "exited"];

  // پیدا کردن مهمان
  const guest = await GuestModel.findById(guestId);
  if (!guest) {
    return res.status(404).json({
      message: "زائر پیدا نشد",
    });
  }

  const currentStatusIndex = statusFlow.indexOf(guest.status);
  if (currentStatusIndex === -1) {
    return res.status(400).json({
      message: "وضعیت فعلی زائر نامعتبر است.",
    });
  }

  // اگر در آخرین وضعیت است (exited)، تغییر نده
  if (currentStatusIndex === statusFlow.length - 1) {
    return res.status(400).json({
      message: "وضعیت نهایی قبلاً ثبت شده است.",
    });
  }

  // تعیین وضعیت بعدی
  const nextStatus = statusFlow[currentStatusIndex + 1];
  if (nextStatus === "exited") {
    const sender = "9982003208";
    const receptor = guest.mobile;
    const link = "https://survey.porsline.ir/s/7CA6H4iC";
    let message = `زائر ارجمند ${guest.namefamily}\n  سپاس از اینکه لالجین، دیار خادمان اربعین، را برای اقامت برگزیدید.\n اگر فرصت دارید، حتما از لالجین، شهر جهانی سفال، دیدن کنید و هنر ناب این سرزمین را به یادگار ببرید.\n  لطفا با پاسخ به نظر سنجی زیر ما را در خدمات  بهتر یاری فرمایید:\n ${link} `;
    // const link = "https://nshn.ir/7b719uO5DglA";

    if (!process.env.KAVENEGAR_API_KEY) {
      console.error("KAVENEGAR_API_KEY is not defined");
      return;
    }

    const api = Kavenegar.KavenegarApi({ apikey: process.env.KAVENEGAR_API_KEY });
    try {
      api.Send({
        message,
        sender,
        receptor
      }, function (response, status) {
        console.log("SMS Response:", response);
        console.log("SMS Status:", status);
      });
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  }
  // بروزرسانی در دیتابیس
  const updateResult = await GuestModel.updateOne(
    { _id: guestId },
    { $set: { status: nextStatus } }
  );

  if (updateResult.modifiedCount === 0) {
    throw createHttpError.BadRequest("عملیات تغییر وضعیت ناموفق بود.");
  }

  return res.status(200).json({
    statusCode: 200,
    data: {
      message: `وضعیت زائر به '${nextStatus}' تغییر یافت.`,
      guest: guest,
    },
  });
}

const servicedGuest = async (req, res) => {
  const { id: guestId } = req.params;

  const guest = await GuestModel.findById(guestId);

  if (!guest) {
    throw createHttpError.NotFound("زائر یافت نشد");
  }

  // برعکس کردن وضعیت
  const newStatus = !guest.isServiced;

  const guestUpdate = await GuestModel.updateOne(
    { _id: guestId },
    {
      $set: {
        isServiced: newStatus,
        // statusChangedAt: new Date(),
      },
    }
  );

  if (guestUpdate.modifiedCount === 0) {
    throw createHttpError.BadRequest("عملیات ناموفق بود.");
  }

  const message = newStatus
    ? "خدمات انجام شد"
    : "خدمات لغو شد";

  return res.status(200).json({
    statusCode: 200,
    data: { message },
  });
};


// Send Message with kavenegar
const sendMessage = async (mobile, namefamily) => {
  const sender = "9982003208";
  const receptor = mobile;
    const link = "https://nshn.ir/7b719uO5DglA";

  const message = `زائر ارجمند ${namefamily}:\n ثبت نام شما با موفقیت انجام شد\n📍موقعیت محل پذیرش:\n${link}\n  پیش از ورود، همکاران ما برای هماهنگی با شما تماس خواهند گرفت.\n ستاد #مردمی اربعین لالجین`;
// console.log(sender,receptor,message)
  if (!process.env.KAVENEGAR_API_KEY) {
    console.error("KAVENEGAR_API_KEY is not defined");
    return;
  }

  const api = Kavenegar.KavenegarApi({ apikey: process.env.KAVENEGAR_API_KEY });
  /* switch (registerOperator) {
    case "زائر":
    case "بهار":
    case "ادمین": */
  // break;
  /* case "پذیرش تلفنی":
  case "لالجین":

    let hostel; let host; eskanType === "public" ? hostel = await findHostelById(hostelId) : host = await findHostById(hostId)

    if (host) {
      message = `زائر ارجمند ${namefamily}:\n به شهر لالجین خوش آمدید \n 💒 میزبان شما ${host.namefamily}\nهماهنگی‌های لازم با میزبان انجام شده است. خادمین، شما را تا محل اسکان همراهی میکنند.
ستاد #مردمی اربعین لالجین `
    }
    else if (hostel) {
      message = `زائر ارجمند ${namefamily}:\n به شهر لالجین خوش آمدید \nمحل اسکان  شما : ${hostel.hostelName}\n 📍آدرس اسکان شما :${hostel.location}\n
ستاد #مردمی اربعین لالجین `
    }
    else {
      throw new Error("میزبان یا محل اسکان یافت نشد");
    }

    break; */

  // }

 /*   try {
    api.Send({
      message,
      sender,
      receptor
    }, function (response, status) {
      console.log("SMS Response:", response);
      console.log("SMS Status:", status);
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
  }  */
   return new Promise((resolve, reject) => {
    api.Send({
       message,
       sender,
       receptor
     }, function (response, status) {
      if (status !== 200) {
        
        reject(new Error("ارسال پیامک ناموفق بود"));
      
      } else {
         resolve(response);
      
      }
     });
   });
};

// Send Message for print  with kavenegar
const sendMessagePrint = async (mobile, namefamily, hostelId, hostId, eskanType) => {
  // console.log(mobile, namefamily, registerOperator, hostelId, hostId,eskanType)
  const sender = "9982003208";
  const receptor = mobile;
let message="";
  if (!process.env.KAVENEGAR_API_KEY) {
    console.error("KAVENEGAR_API_KEY is not defined");
    return;
  }

  const api = Kavenegar.KavenegarApi({ apikey: process.env.KAVENEGAR_API_KEY });


  let hostel; let host; eskanType === "public" ? hostel = await findHostelById(hostelId) : host = await findHostById(hostId)

  if (host) {
    message = `زائر ارجمند ${namefamily}:\n به شهر لالجین خوش آمدید \n 💒 میزبان شما ${host.namefamily}\nهماهنگی‌های لازم با میزبان انجام شده است. خادمین، شما را تا محل اسکان همراهی میکنند.
ستاد #مردمی اربعین لالجین `
  }
  else if (hostel) {
    message = `زائر ارجمند ${namefamily}:\n به شهر لالجین خوش آمدید \nمحل اسکان  شما : ${hostel.hostelName}\n 📍آدرس اسکان شما :${hostel.location}\n
ستاد #مردمی اربعین لالجین `
  }
  else {
    throw new Error("میزبان یا محل اسکان یافت نشد");
  }



  // }


  return new Promise((resolve, reject) => {
    api.Send({
      message,
      sender,
      receptor
    }, function (response, status) {
      if (status !== 200) {
        reject(new Error("ارسال پیامک ناموفق بود"));
      } else {
        resolve(response);
      }
    });
  });
};

// Exports
module.exports = {
  addNewGuest,
  getListOfGuests,
  getAllGuest,
  removeGuest,
  updateGuest,
  getGuestById,
  changeStatus, servicedGuest, sendMessage, updatePrintGuest, setTimeGuest,sendMessagePrint
};
