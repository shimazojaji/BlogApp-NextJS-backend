const mongoose = require("mongoose");

const ServerToguestSchema = new mongoose.Schema({
    namefamily: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    serverSkill: { type: String, required: true },
    serverFavorite: { type: String, required: true },
    serverTime: { type: String, required: true },
  userRole: { type: String, default: "USER" }


}, {
    timestamps: true,
});

module.exports = {
    ServerToguestModel: mongoose.model("ServerToguest", ServerToguestSchema),
};
