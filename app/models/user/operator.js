const mongoose = require("mongoose");

const OperatorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,

  },
  mobile: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  role: { type: String, required: true }
}, {
  timestamps: true
});


module.exports = {
  OperatorModel: mongoose.model("Operator", OperatorSchema),
};