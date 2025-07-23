const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const OperatorSchema = new mongoose.Schema({

  mobile: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  userRole: { type: String, default: "OPERATOR" },
  name: { type: String, required: true },
  operatorStatus: { type: String, default: "offline" },
  // operatorOperation: [{ type: String }],

  // hostelID: { type: ObjectedId, ref:"Hostel" }
}, {
  timestamps: true
});


module.exports = {
  OperatorModel: mongoose.model("Operator", OperatorSchema),
};