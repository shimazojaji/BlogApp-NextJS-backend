const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema({
  hostelName: { type: String, required: true },
  address: { type: String, required: true },
  maleNo: { type: Number, required: true },
  femaleNo: { type: Number, required: true },
  foodStatus: { type: Boolean, default: false },
  isMedical: { type: Boolean, default: false },
  operatorId: { type:mongoose.Schema.Types.ObjectId, ref: 'Operator',required: true},

  bathroomStatus: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = {
  HostelModel: mongoose.model("Hostel", HostelSchema),
};
