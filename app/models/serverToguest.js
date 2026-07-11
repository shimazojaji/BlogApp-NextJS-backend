const mongoose = require("mongoose");

const ServerToguestSchema = new mongoose.Schema({
    namefamily: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    serverSkill: { type: String, required: true },
    gender: { type: String, required: true },
    serverHistory: { type: String, required: true },
    birthDate: { type: String, default: new Date() },
    status: { type: String, default: "pending" },
    category:[{ type: String }],
    userRole: { type: String, default: "USER" }


}, {
    timestamps: true,
});

module.exports = {
    ServerToguestModel: mongoose.model("ServerToguest", ServerToguestSchema),
};
