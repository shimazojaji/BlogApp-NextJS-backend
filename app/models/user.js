const mongoose = require("mongoose");

const ZaerSchema = new mongoose.Schema({
    nameFamily: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
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
    userRole: { type: String, default: "guest" },
    identitiy: { type: String }
}, {
    timestamps: true,
});
GuestSchema.pre("save", function (next) {
    if (this.isModified("status")) {
        this.statusChangedAt = new Date();
    }
    next();
});
module.exports = {
    GuestModel: mongoose.model("Guest", GuestSchema),
};
