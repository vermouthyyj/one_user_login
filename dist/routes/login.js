"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = require("crypto");
const authService_1 = __importDefault(require("../services/authService"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
// Connect to the MongoDB database
mongoose_1.default.connect("mongodb+srv://Cluster65364:7AS99WtrYyq55skl@cluster65364.npvw6o7.mongodb.net/user_service", {});
const loginAttempts = {};
// Render login views
router.get("/", function (req, res) {
    res.render("login");
});
router.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const username = req.body.username;
            const password = req.body.password;
            // Check null value
            if (username == null || username.trim() == "" || password == null || password.trim() == null) {
                res.status(500).json({ error: "Username/Password cannot be empty" });
                return;
            }
            // Check if the user is locked
            if (loginAttempts[username] && loginAttempts[username].locked) {
                res.status(401).json({ error: "Account locked. Please contact support." });
                return;
            }
            // md5: hash password
            const md5String = (0, crypto_1.createHash)("md5").update(password).digest("hex");
            const queryString = { username: username, userpswd: md5String };
            res.set({ "Content-type": "application/json;charset=utf-8" });
            const user = yield userRepository_1.default.findUser(queryString);
            if (user) {
                const token = yield authService_1.default.authenticateUser(username, password);
                res.send({ code: 1, message: "Login Successfully", token });
            }
            else {
                trackFailedLogin(username);
                res.status(401).json({ error: "Incorrect Username and Password" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});
function trackFailedLogin(username) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (!loginAttempts[username]) {
        loginAttempts[username] = { attempts: 1, timestamps: [currentTimestamp] };
    }
    else {
        loginAttempts[username].attempts++;
        loginAttempts[username].timestamps.push(currentTimestamp);
        // Check if there are 3 or more failed attempts in the last 5 minutes
        const recentAttempts = loginAttempts[username].timestamps.filter((timestamp) => currentTimestamp - timestamp <= 300);
        console.log("loginAttempts: ", loginAttempts);
        if (recentAttempts.length >= 2) {
            // Lock the user
            loginAttempts[username].locked = true;
        }
    }
}
exports.default = router;
