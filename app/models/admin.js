const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
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
  userRole: { type: String, default: "ADMIN" }
}, {
  timestamps: true
});


module.exports = {
  AdminModel: mongoose.model("Admin", AdminSchema),
};