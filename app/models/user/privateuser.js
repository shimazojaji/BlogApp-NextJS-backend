const mongoose = require("mongoose");

const PrivateUserSchema = new mongoose.Schema({
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
 
  }
}, {
  timestamps: true
});


module.exports = {
    PrivateUserModel: mongoose.model("PrivateUser", PrivateUserSchema),
};