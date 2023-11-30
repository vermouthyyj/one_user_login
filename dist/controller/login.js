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
exports.loginController = void 0;
/* eslint-disable */
const authService_1 = __importDefault(require("../services/authService"));
class LoginController {
    renderLoginPage(req, res) {
        res.render("login");
    }
    handleLoginRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const username = req.body.username;
                const password = req.body.password;
                const result = yield authService_1.default.handleLoginRequest(username, password);
                res.send(result);
            }
            catch (error) {
                res.status(500).send({ error: error.message });
            }
        });
    }
}
exports.loginController = new LoginController();
