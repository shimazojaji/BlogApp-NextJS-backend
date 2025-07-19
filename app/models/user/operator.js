const mongoose = require("mongoose");

const OperatorSchema = new mongoose.Schema({

  mobile: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  userRole: { type: String, default: "OPERATOR" },
  name: { type: String, required: true },
  operatorStatus: { type: String, default: "offline" },
  // operatorOperation: [{ type: String }],
  hostelName: { type: String, default: "نامشخص" }
}, {
  timestamps: true
});


module.exports = {
  OperatorModel: mongoose.model("Operator", OperatorSchema),
};