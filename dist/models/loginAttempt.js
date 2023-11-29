"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LoginAttemptSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    attempts: { type: Number, required: true },
    timestamps: { type: [Number], required: true },
    locked: { type: Boolean, default: false },
});
// const LoginAttempt = mongoose.model<LoginAttemptModel>("LoginAttempt", LoginAttemptSchema, "login_attempt")
const LoginAttempt = (0, mongoose_1.model)("LoginAttempt", LoginAttemptSchema, "login_attempt");
exports.default = LoginAttempt;
