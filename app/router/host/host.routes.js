const express = require("express");
const { addNewHost, getListOfHosts,  removeHost, decreaseGuestNo, updateHost, getHostById, foodService, medicalService } = require("../../http/controllers/host.controller");
const router = express.Router();
const { verifyAccessToken, decideAuthMiddleware } = require("../../http/middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");


// POST /host/add 
router.post("/add", addNewHost);

//GET/host/list
router.get(
  "/list", getListOfHosts);

router.delete("/remove/:id", verifyAccessToken, expressAsyncHandler(removeHost));
router.patch("/decrease/:id", verifyAccessToken, expressAsyncHandler(decreaseGuestNo));
router.patch("/update/:id", verifyAccessToken, expressAsyncHandler(updateHost));
router.get("/:id", decideAuthMiddleware, expressAsyncHandler(getHostById));
router.post(
  "/food/:id",
  verifyAccessToken,
  expressAsyncHandler(foodService)
);

router.post(
  "/medical/:id",
  verifyAccessToken,
  expressAsyncHandler(medicalService)
);
 /*  router.get("/available", getAvailableHosts); */
module.exports = router;



