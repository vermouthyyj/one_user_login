"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: String,
    userpswd: String,
    logindate: Date,
});
const UserInfo = (0, mongoose_1.model)("UserInfo", UserSchema, "user_info");
exports.default = UserInfo;
