const express = require("express");
const router = express.Router();
const serverRoutes = require("./serverToguest/serverToguest.routes");
const hostRoutes = require("./host/host.routes");
const guestRoutes = require("./guest/guest.routes");
const userAuthRoutes = require("./user/auth.routes");
const hostelRoutes = require("./hostel/hostel.routes")
const operatorRoutes=require("./operator/operator.routes")
// const newsRoutes = require("./news/news.routes")
router.use("/server", serverRoutes);
router.use("/host", hostRoutes);
router.use("/guest", guestRoutes);
router.use("/user", userAuthRoutes);
router.use("/hostel", hostelRoutes);
router.use("/operator",operatorRoutes)
// router.use("/news",newsRoutes);

module.exports = router;




