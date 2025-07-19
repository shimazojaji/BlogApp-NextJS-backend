const express = require("express");
const router = express.Router();

const { verifyAccessToken, decideAuthMiddleware } = require("../../http/middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const { addHostel, getHostels, removeHostel, updateHostel, getHostelById, decreaseCapacity, foodService, medicalService } = require("../../http/controllers/hostel.controller");


// POST /hostel/add - Create new entry
router.post("/add", verifyAccessToken, expressAsyncHandler(addHostel)
);



// GET /hostel/list - List all entries

router.get("/list", verifyAccessToken, expressAsyncHandler(getHostels))

// Remove, update, get by ID
router.delete("/remove/:id", verifyAccessToken, expressAsyncHandler(removeHostel));
router.patch("/update/:id", verifyAccessToken, expressAsyncHandler(updateHostel));
router.patch("/decrease/:id", verifyAccessToken, expressAsyncHandler(decreaseCapacity));

router.get("/:id", decideAuthMiddleware, expressAsyncHandler(getHostelById));
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
module.exports = router;
