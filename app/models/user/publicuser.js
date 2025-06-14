const mongoose = require("mongoose");

const PublicUserSchema = new mongoose.Schema({
  name: { type: String },
  family:{ type: String },
  mobile: { type: String, required: true, unique: true },
 

}, {
  timestamps: true,
});

module.exports = {
  PublicUserModel: mongoose.model("PublicUser", PublicUserSchema),
};