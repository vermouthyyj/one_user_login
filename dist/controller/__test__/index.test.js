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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const mockRequest = (sessionData) => ({ session: sessionData || {} });
const mockResponse = () => {
    const res = {};
    res.redirect = jest.fn();
    res.render = jest.fn();
    return res;
};
describe("UserController", () => {
    describe("login", () => {
        it('should render "index" if user is logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ user: { username: "testUser" } });
            req.session.user = { username: "testUser" };
            const res = mockResponse();
            yield index_1.userController.login(req, res);
            expect(res.render).toHaveBeenCalledWith("index", { title: "Express" });
            expect(res.redirect).not.toHaveBeenCalled();
        }));
        it('should redirect to "/login" with an error message if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest();
            const res = mockResponse();
            yield index_1.userController.login(req, res);
            expect(res.redirect).toHaveBeenCalledWith("/login");
            expect(req.session.error).toBe("Please login");
            expect(res.render).not.toHaveBeenCalled();
        }));
    });
});
