
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { ServerToguestModel } = require("../../models/serverToguest");
const { addServerSchema } = require("../validators/servertoguest/serverToguest.schema");

/**
* List (server) entries 
*/
const getListOfServers = async (req, res, next) => {
  try {
    const query = req.query;


    const servers = await Promise.all([
      ServerToguestModel.find(query),
    ]);

    res.json({
      date: {
        servers,
      }
    });
  } catch (err) {
    next(err);
  }
};
const addNewServer = async (req, res, next) => {
  try {
    await addServerSchema.validateAsync(req.body);

    const exists = await ServerToguestModel.findOne({ mobile: req.body.mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلاً ثبت شده است");

    const servers = await ServerToguestModel.create(req.body);

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "اطلاعات میزبان با موفقیت ثبت شد",
      data: servers,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  addNewServer,
  getListOfServers,
};
