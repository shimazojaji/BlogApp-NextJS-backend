const express = require("express");
const router = express.Router();
const serverRoutes = require("./serverToguest/serverToguest.routes");
const hostRoutes = require("./host/host.routes");
const guestRoutes = require("./guest/guest.routes");
const userAuthRoutes=require("./user/auth.routes");
const adminRoutes = require("./admin/admin.routes");
router.use("/server", serverRoutes);
router.use("/host", hostRoutes);
router.use("/guest", guestRoutes);
router.use("/user",userAuthRoutes);
router.use("/admin",adminRoutes);

module.exports = router;




