const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema({
  hostelName: { type: String, required: true },
  address: { type: String, required: true },
  // hostelOwnName: { type: String, required: true },
  capacity: { type: Number, required: true },
  foodStatus: { type: String, enum: ["yes", "no"], required: true },
  isMedical: { type: Boolean, default: false },

  bathroomStatus: { type: String, enum: ["yes", "no"], required: true },
}, {
  timestamps: true,
});

module.exports = {
  HostelModel: mongoose.model("Hostel", HostelSchema),
};
