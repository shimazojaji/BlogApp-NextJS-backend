const express = require("express");
const router = express.Router();

const { verifyAccessToken, decideAuthMiddleware } = require("../../http/middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const { addOperator, getOperators, removeOperator, updateOprator, getOperatorById } = require("../../http/controllers/operator.controlley");


// POST /operator/add - Create new entry
router.post("/add", verifyAccessToken, expressAsyncHandler(addOperator)
);



// GET /operator/list - List all entries

router.get("/list", verifyAccessToken, expressAsyncHandler(getOperators))

// Remove, update, get by ID
router.delete("/remove/:id", verifyAccessToken, expressAsyncHandler(removeOperator));
router.patch("/update/:id", verifyAccessToken, expressAsyncHandler(updateOprator));
router.get("/:id", decideAuthMiddleware, expressAsyncHandler(getOperatorById));

module.exports = router;
