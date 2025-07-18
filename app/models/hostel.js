const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema({
  hostelName: { type: String, required: true },
  address: { type: String, required: true },
  // hostelOwnName: { type: String, required: true },
  capacity: { type: Number, required: true },
  foodStatus: { type: Boolean, default: false  },
  isMedical: { type: Boolean, default: false },
operatorId:{type:String,default:"unknown"},

  bathroomStatus: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = {
  HostelModel: mongoose.model("Hostel", HostelSchema),
};
