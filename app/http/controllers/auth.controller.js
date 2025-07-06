const {

  VerifyRefreshToken,
  setAccessToken,
  setRefreshToken,
} = require("../../utils/functions");
const Controller = require("./controller");
const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
// const {
//   validateSigninPrivateUserSchema,
//   validateSigninPublicUserSchema

// } = require("../validators/user/auth.schema");
const path = require("path");
const bcrypt = require("bcryptjs");
const { HostModel } = require("../../models/host");
const { ServerToguestModel } = require("../../models/serverToguest");
const CODE_EXPIRES = 90 * 1000; //90 seconds in miliseconds
const Kavenegar = require("kavenegar");
const { GuestModel } = require("../../models/guest");
const { OperatorModel } = require("../../models/user/operator");
const { validateAdminLoginSchema } = require("../validators/user/admin.schema");
const { AdminModel } = require("../../models/user/admin");
const { validateperatorLoginSchema, validatePartialOperatorSchema } = require("../validators/operator/operator.schema");

class UserAuthController extends Controller {
  constructor() {
    super();
    this.code = 0;
    // this.mobile = null;
  }

  /*  async sendOtp(req, res) {
     const { mobile } = req.body;
     if (!mobile) {
       throw createError.BadRequest("شماره موبایل معتبر را وارد کنید");
     }
 
     // ✅ Generate random OTP code (you can change this logic)
     const code = Math.floor(100000 + Math.random() * 900000); // e.g., 6-digit OTP
 
     const kaveNegarApi = Kavenegar.KavenegarApi({
       apikey: `${process.env.KAVENEGAR_API_KEY}`,
     });
 
     kaveNegarApi.VerifyLookup(
       {
         receptor: mobile,
         token: code.toString(),
         template: "registerVerify",
       },
       (response, status) => {
         console.log("kavenegar message status", status, mobile);
 
         if (response && status === 200) {
           return res.status(HttpStatus.OK).send({
             statusCode: HttpStatus.OK,
             data: {
               message: `کد تائید برای شماره موبایل ${toPersianDigits(mobile)} ارسال گردید`,
               expiresIn: CODE_EXPIRES,
               mobile,
               code, // Optional: you may want to remove this in production
             },
           });
         }
 
         return res.status(status).send({
           statusCode: status,
           message: "کد اعتبارسنجی ارسال نشد",
         });
       }
     );
   }
 
   async getOtp(req, res) {
 
     let { mobile } = req.body;
 
     if (!mobile)
       throw createError.BadRequest("شماره موبایل معتبر را وارد کنید");
 
     mobile = mobile.trim();
     this.mobile = mobile;
     this.code = generateRandomNumber(6);
 
     const result = await this.saveUser(mobile);
     if (!result) throw createError.Unauthorized("ورود شما انجام نشد.");
 
     // send OTP
     this.sendOTP(mobile, res);
   }
   async saveUser(mobile) {
     const otp = {
       code: this.code,
       expiresIn: Date.now() + CODE_EXPIRES,
     };
 
     const user = await this.checkUserExist(mobile);
     if (user) return await this.updateUser(mobile, { otp });
 
     return await GuestModel.create({
       mobile,
       otp,
       // role: ROLES.USER,
     });
   }
 
   sendOTP(mobile, res) {
     const kaveNegarApi = Kavenegar.KavenegarApi({
       apikey: `${process.env.KAVENEGAR_API_KEY}`,
     });
     kaveNegarApi.VerifyLookup(
       {
         receptor: mobile,
         token: this.code,
         template: "registerVerify",
       },
       (response, status) => {
         console.log("kavenegar message status", status);
         if (response && status === 200)
           return res.status(HttpStatus.OK).send({
             statusCode: HttpStatus.OK,
             data: {
               message: `کد تائید برای شماره موبایل ${toPersianDigits(
                 phoneNumber
               )} ارسال گردید`,
               expiresIn: CODE_EXPIRES,
               phoneNumber,
             },
           });
 
         return res.status(status).send({
           statusCode: status,
           message: "کد اعتبارسنجی ارسال نشد",
         });
       }
     );
   } */


  // ===============
  // Admin
  // ===============
  async AdminLogin(req, res) {
    await validateAdminLoginSchema(req.body);

    const { username, password } = req.body;

    // checking if the admin is already in the data base :

    const admin = await this.checkAdminExist(username.toLowerCase());

    if (!admin) {
      throw createError.BadRequest("نام کاربری  اشتباه است");
    }


    // PASSWORD IS CORRECT :
    const validPass = await bcrypt.compare(password, admin.password);

    if (!validPass)
      throw createError.BadRequest("رمز عبور اشتباه است");

    await setAccessToken(res, admin);
    await setRefreshToken(res, admin);
    let WELLCOME_MESSAGE = `ورود با موفقیت انجام شد`;

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: WELLCOME_MESSAGE,
        admin,
      },
    });
  }


  async checkAdminExist(username) {
    const admin = await AdminModel.findOne({ username });
    return admin;
  }


  async OperatorLogin(req, res) {
    await validatePartialOperatorSchema(req.body)
    const { code } = req.body;
    const user = await OperatorModel.findOne({ code })

    if (!user) {
      throw createError.BadRequest(" کاربری  پیدا نشد  ");
    }




    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    let WELLCOME_MESSAGE = `ورود با موفقیت انجام شد`;

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: WELLCOME_MESSAGE,
        user,
      },
    });
  }

  async signinPublicUser(req, res) {
    await validateSigninPublicUserSchema(req.body);

    const { mobile, role } = req.body;


    const user = await this.findUserByRole(mobile, role);
    if (!user) {
      throw createError.BadRequest(" کاربری با این موبایل پیدا نشد  ");
    }




    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    let WELLCOME_MESSAGE = `ورود با موفقیت انجام شد`;

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: WELLCOME_MESSAGE,
        user,
      },
    });

  }

  async login(req, res) {
    await validateSigninPublicUserSchema(req.body);
    const { mobile, role } = req.body;

    const user = await this.findUserByRole(mobile, role);
    if (!user) throw createError.BadRequest("کاربری یافت نشد");

    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    let WELLCOME_MESSAGE = `ورود با موفقیت انجام شد`;

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: WELLCOME_MESSAGE,
        user,
        role
      },
    });



  }

  async findUserByRole(mobile, role) {
    switch (role) {
      case "guest":
        return await GuestModel.findOne({ mobile });
      case "host":
        return await HostModel.findOne({ mobile });
      case "server":
        return await ServerToguestModel.findOne({ mobile });
      default:
        throw createError.BadRequest("نقش نامعتبر است");
    }
  }


  async refreshToken(req, res) {
    const userId = await VerifyRefreshToken(req);
    const user = (await OperatorModel.findById(userId)) || (await GuestModel.findById(userId)) || (await HostModel.findById(userId)) || ((await ServerToguestModel.findById(userId)));
    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      data: {
        user,
      },
    });
  }
  // async checkUserExist(username) {
  //   const user = await PrivateUserModel.findOne({ username });
  //   return user;
  // }
  logout(req, res) {
    const cookieOptions = {
      maxAge: 1,
      expires: Date.now(),
      httpOnly: true,
      signed: true,
      sameSite: "Lax",
      secure: true,
      path: "/",
      domain: process.env.DOMAIN,
    };
    res.cookie("accessToken", null, cookieOptions);
    res.cookie("refreshToken", null, cookieOptions);

    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      auth: false,
    });
  }


  // async getUserProfilePv(req, res) {
  //   const { _id: userId } = req.user;
  //   const user = await PrivateUserModel.findById(userId, { otp: 0 });

  //   return res.status(HttpStatus.OK).json({
  //     statusCode: HttpStatus.OK,
  //     data: {
  //       user,
  //     },
  //   });
  // }
  // async getAllUsers(req, res) {
  //   const users = await PrivateUserModel.find();

  //   return res.status(HttpStatus.OK).json({
  //     statusCode: HttpStatus.OK,
  //     data: {
  //       users,
  //     },
  //   });
  // }

  async getProfileGuest(req, res) {
    const { _id } = req.user; // Instead of mobile from query (more secure)
    const guest = await GuestModel.findById(_id); // or GuestModel.findOne({ mobile })

    if (!guest) {
      throw createError.NotFound("زائر پیدا نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { guest },
    });
  }

  async getProfileAdmin(req, res) {
    const { _id } = req.user; // Instead of mobile from query (more secure)
    const admin = await AdminModel.findById(_id); // or GuestModel.findOne({ mobile })
    if (!admin) {
      throw createError.NotFound("ادمین پیدا نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { admin },
    });
  }

 async getProfileOperator(req, res) {
    const { _id } = req.user; // Instead of mobile from query (more secure)
    const operator = await OperatorModel.findById(_id); // or GuestModel.findOne({ mobile })
    if (!operator) {
      throw createError.NotFound("ادمین پیدا نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { operator },
    });
  }

}

module.exports = {
  UserAuthController: new UserAuthController(),
};
