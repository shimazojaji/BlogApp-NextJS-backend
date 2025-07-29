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


// POST /server/add 
router.post("/add", async (req, res, next) => {
    try {
        await addServerSchema.validateAsync(req.body);
        const { mobile, namefamily } = req.body;

        const exists = await ServerToguestModel.findOne({ mobile: req.body.mobile });
        if (exists) throw createHttpError.Conflict("شماره موبایل قبلا ثبت شده است");

        const server = await ServerToguestModel.create(req.body);
        await sendMessage(mobile, namefamily)
        res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            message: "ثبت اطلاعات با موفقیت انجام شد",
            data: server,
        });
        
        /*  res.status(201).json({
             message: "ثبت اطلاعات با موفقیت انجام شد",
             data: server,
             
         }); */
    } catch (err) {
        next(err);
    }
});
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
