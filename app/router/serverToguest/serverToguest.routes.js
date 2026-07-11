const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const { ServerToguestModel } = require("../../models/serverToguest");
const { addServerSchema } = require("../../http/validators/servertoguest/serverToguest.schema");
const expressAsyncHandler = require("express-async-handler");
const { getListOfServers, getServerById, updateServer, removeServer, sendMessage } = require("../../http/controllers/serverToguest.controller");
const { verifyAccessToken, decideAuthMiddleware } = require("../../http/middlewares/auth.middleware");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { uploadFile } = require("../../utils/multer");
const { addNewServerToGuest } = require("../../http/controllers/server.controller");


// POST /server/add 
router.post(
    "/add",
    uploadFile.single("photo"),

    expressAsyncHandler(addNewServerToGuest)
);

router.get("/list", verifyAccessToken, expressAsyncHandler(getListOfServers))

router.get("/:id", decideAuthMiddleware, expressAsyncHandler(getServerById));

router.patch("/update/:id", verifyAccessToken, expressAsyncHandler(updateServer));
router.delete("/remove/:id", verifyAccessToken, expressAsyncHandler(removeServer));

// // GET /server/list 
// router.get("/list", async (req, res, next) => {
//     try {
//         const all = await ServerToguestModel.find().sort({ createdAt: -1 });
//         res.json({ data: all });
//     } catch (err) {
//         next(err);
//     }
// });

module.exports = router;
