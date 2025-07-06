const mongoose = require("mongoose");

const OperatorSchema = new mongoose.Schema({

  mobile: { type: String, required: true,unique:true },
  code: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  userRole: { type: String, default: "OPERATOR" }

}, {
  timestamps: true
});


module.exports = {
  OperatorModel: mongoose.model("Operator", OperatorSchema),
};