const { ROLES } = require("../../utils/constants");
const { authorize } = require("../../http/middlewares/permission.guard");
const guestAdminRoutes = require("../admin/guest.routes");


const router = require("express").Router();

router.use("/guest", authorize(ROLES.ADMIN), guestAdminRoutes);


module.exports = {
  adminRoutes: router,
};
