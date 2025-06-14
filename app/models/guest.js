const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  namefamily: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  maleNo: { type: Number, required: true },
  femaleNo: { type: Number, required: true },
  childNo: { type: Number, required: true },
  city: { type: String, required: true },
  startDate: { type: String, required: true },

}, {
  timestamps: true,
});

module.exports = {
  GuestModel: mongoose.model("Guest", GuestSchema),
};
