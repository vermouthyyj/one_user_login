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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const user_1 = __importDefault(require("../models/user"));
const shelljs_1 = require("shelljs");
const loginAttempt_1 = __importDefault(require("../models/loginAttempt"));
class AuthService {
    static authenticateUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input
            if (!username || !password) {
                throw new Error("Username and password are required.");
            }
            // Authenticate user
            const md5String = (0, crypto_1.createHash)("md5").update(password).digest("hex");
            const user = yield user_1.default.findOne({ username, userpswd: md5String });
            if (user) {
                // Generate JWT token
                const content = { username };
                const secretOrPrivateKey = "secretKey";
                const token = jsonwebtoken_1.default.sign(content, secretOrPrivateKey, {
                    expiresIn: 60 * 60 * 24 * 7, // token expires in 1 week
                });
                return token;
            }
            else {
                throw new Error("Incorrect Username and Password");
            }
        });
    }
    static trackFailedLogin(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            try {
                let loginAttempt = yield loginAttempt_1.default.findOne({ username });
                if (!loginAttempt) {
                    loginAttempt = new loginAttempt_1.default({
                        username,
                        attempts: 1,
                        timestamps: [currentTimestamp],
                    });
                }
                else {
                    loginAttempt.attempts++;
                    loginAttempt.timestamps.push(currentTimestamp);
                    // Check if there are 3 or more failed attempts in the last 5 minutes
                    const recentAttempts = loginAttempt.timestamps.filter((timestamp) => currentTimestamp - timestamp <= 300);
                    if (recentAttempts.length >= 3) {
                        // Lock the user
                        loginAttempt.locked = true;
                    }
                }
                yield loginAttempt.save();
            }
            catch (_a) {
                console.error("Error tracking failed login:", shelljs_1.error);
            }
        });
    }
}
exports.default = AuthService;
