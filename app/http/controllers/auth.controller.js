const {
  VerifyRefreshToken,
  setAccessToken,
  setRefreshToken,
} = require("../../utils/functions");
const Controller = require("./controller");
const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const {
  validateSigninPrivateUserSchema,
  validateSigninPublicUserSchema

} = require("../validators/user/auth.schema");
const path = require("path");
const { PrivateUserModel } = require("../../models/user/privateuser");
const bcrypt = require("bcryptjs");
const { HostModel } = require("../../models/host");
const { GuestModel } = require("../../models/guest");
const { ServerToguestModel } = require("../../models/serverToguest");
class UserAuthController extends Controller {
  constructor() {
    super();
  }

  async signinPrivateUser(req, res) {
    await validateSigninPrivateUserSchema(req.body);

    const { username, password } = req.body;

    // checking if the user is already in the data base :

    const user = await this.checkUserExist(username.toLowerCase());

    if (!user) {
      throw createError.BadRequest("نام کاربری  اشتباه است");
    }


    // PASSWORD IS CORRECT :
    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass)
      throw createError.BadRequest("رمز عبور اشتباه است");

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


    const user = await this.findUserByRole(mobile,role);
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
    const user = await PrivateUserModel.findById(userId);
    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      data: {
        user,
      },
    });
  }
  async checkUserExist(username) {
    const user = await PrivateUserModel.findOne({ username });
    return user;
  }
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
 async getUserProfilePv(req, res) {
    const { _id: userId } = req.user;
    const user = await PrivateUserModel.findById(userId, { otp: 0 });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user,
      },
    });
  }
  async getAllUsers(req, res) {
    const users = await PrivateUserModel.find();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        users,
      },
    });
  }

}

module.exports = {
  UserAuthController: new UserAuthController(),
};
