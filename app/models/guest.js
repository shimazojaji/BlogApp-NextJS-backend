const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  namefamily: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  maleNo: { type: Number, required: true },
  femaleNo: { type: Number, required: true },
  childNo: { type: Number, required: true },
  city: { type: String, default: "نامشخص" },
  startDate: { type: String, default: new Date() },
  status: { type: String, default: "pending" },
  hostel: { type: String, default: "unknown" },
  hostelAddress: { type: String ,default:"unknown"},
  isNeedDrug: { type: Boolean, default: false },
  isNeedMedicine: { type: Boolean, default: false },
  isNeedFood: { type: Boolean, default: false },
  isNeedSpecialServices: { type: Boolean, default: false },
  isNeedShower: { type: Boolean, default: false },
  isServiced: { type: Boolean, default: false },
  statusChangedAt: { type: Date },
  operatorOperation: [{ type: String }],
  operatorName: [{ type: String }],
  userRole: { type: String, default: "USER" },
  comment: { type: String, default: "..." },
  registerOperator: { type: String, default: "زائر" },
  registerType: { type: String, default: "online" },
}, {
  timestamps: true,
});
// GuestSchema.pre("save", function (next) {
//   if (this.isModified("status")) {
//     this.statusChangedAt = new Date();
//   }
//   next();
// });
module.exports = {
  GuestModel: mongoose.model("Guest", GuestSchema),
};
