const createHttpError = require("http-errors");
const { GuestModel } = require("../../models/guest");
const { HostModel } = require("../../models/host");
const { OperatorModel } = require("../../models/user/operator");

 function authorize(...allowedRoles) {
  return async function (req, res, next) {
    try {
      if (!req.user || !req.user._id) {
        throw createHttpError.Unauthorized("لطفا وارد حساب کاربری خود شوید");
      }

      const userId = req.user._id;

      const guest = await GuestModel.findById(userId);
      if (guest && (allowedRoles.length === 0 || allowedRoles.includes(guest.userRole)))
        return next();

      const host = await HostModel.findById(userId);
      if (host && (allowedRoles.length === 0 || allowedRoles.includes(host.userRole)))
        return next();

      const server = await ServerToguestModel.findById(userId);
      if (server && (allowedRoles.length === 0 || allowedRoles.includes(server.userRole)))
        return next();

      const operator = await OperatorModel.findById(userId);
      if (operator && (allowedRoles.length === 0 || allowedRoles.includes(operator.userRole)))
        return next();

      throw createHttpError.Forbidden("شما به این قسمت دسترسی ندارید");

    } catch (error) {
      next(error);
    }
  };
}
module.exports = {
  authorize,
};