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
}
exports.default = AuthService;
