"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = require("../controller/login");
const mongoose_1 = __importDefault(require("mongoose"));
// Connect to the MongoDB database
mongoose_1.default.connect("mongodb+srv://Cluster65364:7AS99WtrYyq55skl@cluster65364.npvw6o7.mongodb.net/user_service", {});
const router = express_1.default.Router();
// Render login views
router.get("/", login_1.loginController.renderLoginPage);
router.post("/", login_1.loginController.handleLoginRequest);
exports.default = router;
