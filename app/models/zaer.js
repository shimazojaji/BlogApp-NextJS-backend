const mongoose = require("mongoose");

const ZaerSchema = new mongoose.Schema({
  nameFamily: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  maleNo: { type: Number, required: true },
  femaleNo: { type: Number, required: true },
  childNo: { type: Number, required: true },
  city: { type: String, required: true },
  startDate: { type: String, required: true },
  status: { type: String, default: "isPending" },
  hostel: { type: String, default: "unknown" },
  hostelAddress: { type: String, default: "" },
  isNeedDrug: { type: Boolean, default: false },
  isNeedMedicine: { type: Boolean, default: false },
  isNeedFood: { type: Boolean, default: false },
  isNeedSpecialServices: { type: Boolean, default: false },
  isNeedShower: { type: Boolean, default: false },
  isServiced: { type: Boolean, default: false },
  statusChangedAt: { type: Date },
  userRole: { type: String, default: "USER" },
  comment: { type: String }
}, {
  timestamps: true,
});
GuestSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusChangedAt = new Date();
  }
  next();
});
module.exports = {
  GuestModel: mongoose.model("Guest", GuestSchema),
};
