const { ROLES } = require("../../utils/constants");
const { authorize } = require("../../http/middlewares/permission.guard");
const guestAdminRoutes = require("../admin/guest/guest.routes");
const operatorAdminRoutes=require("../admin/operator/operator.routes")

const router = require("express").Router();

router.use("/guest", authorize(ROLES.ADMIN), guestAdminRoutes);
router.use("/operator", operatorAdminRoutes);


module.exports = router
