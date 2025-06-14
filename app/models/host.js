const mongoose = require("mongoose");

const HostSchema = new mongoose.Schema({
    namefamily: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    guestNo: { type: Number, required: true },
    guestGeneder: { type: String, required: true },
    startDate: { type: String, required: true }, // or Date type if needed
    endDate: { type: String, required: true }, // or Date type if needed

}, {
    timestamps: true,
});

module.exports = {
   HostModel: mongoose.model("Host", HostSchema),
};
