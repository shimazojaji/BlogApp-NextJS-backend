const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema({
  hostelName: { type: String, required: true },
  hostelOwnName: { type: String, required: true },
  hostelType: { type: String, enum: ["private", "public"], required: true },
  capacity: { type: Number, required: true },
  foodStatus: { type: String, enum: ["yes", "no"], required: true },
  bathroomStatus: { type: String, enum: ["yes", "no"], required: true },
}, {
  timestamps: true,
});

module.exports = {
  HostelModel: mongoose.model("Hostel", HostelSchema),
};
