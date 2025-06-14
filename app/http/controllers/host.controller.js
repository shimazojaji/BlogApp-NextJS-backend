
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { HostModel } = require("../../models/host");
const { addHostSchema } = require("../validators/host/host.schema");

/**
* List (host) entries 
*/
const getListOfHosts = async (req, res, next) => {
  try {
    const query = req.query;


    const hosts = await Promise.all([
      HostModel.find(query),
    ]);

    res.json({
      date: {
        hosts,
      }
    });
  } catch (err) {
    next(err);
  }
};
const addNewHost = async (req, res, next) => {
  try {
    await addHostSchema.validateAsync(req.body);

    const exists = await HostModel.findOne({ mobile: req.body.mobile });
    if (exists) throw createHttpError.Conflict("شماره موبایل قبلاً ثبت شده است");

    const hosts = await HostModel.create(req.body);

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "اطلاعات میزبان با موفقیت ثبت شد",
      data: hosts,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  addNewHost,
  getListOfHosts,
};
