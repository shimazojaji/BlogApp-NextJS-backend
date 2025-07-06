const express = require("express");
const router = express.Router();

const { verifyAccessToken, decideAuthMiddleware } = require("../../../http/middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const { removeGuest, updateGuest, getGuestById, getAllGuest, addNewGuest } = require("../../../http/controllers/guest.controller");


// POST /guest/add - Create new entry
router.post("/add", router.post("/add",verifyAccessToken, expressAsyncHandler(addNewGuest)));



// GET /guest/list - List all entries
router.get("/list", router.post("/add",verifyAccessToken, expressAsyncHandler(getAllGuest))
);

// Remove, update, get by ID
router.delete("/remove/:id", verifyAccessToken, expressAsyncHandler(removeGuest));
router.patch("/update/:id", verifyAccessToken, expressAsyncHandler(updateGuest));
router.get("/:id", decideAuthMiddleware, expressAsyncHandler(getGuestById));

module.exports = router;
