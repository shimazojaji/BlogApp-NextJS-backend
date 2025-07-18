const mongoose = require("mongoose");

const HostSchema = new mongoose.Schema({
    namefamily: { type: String, required: true },
    address: { type: String, required: true },
    maleNo: { type: Number, required: true },
    femaleNo: { type: Number, required: true },
    mobile: { type: String, required: true, unique: true },

    isFood: { type: Boolean, default: false },
    isMedical: { type: Boolean, default: false },
    isBath: { type: Boolean, default: true },
    startDate: { type: String, required: true }, // or Date type if needed
    endDate: { type: String, required: true }, // or Date type if needed
    userRole: { type: String, default: "USER" }

}, {
    timestamps: true,
});

module.exports = {
    HostModel: mongoose.model("Host", HostSchema),
};
