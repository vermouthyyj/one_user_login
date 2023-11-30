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
const jest_mock_1 = require("jest-mock");
const login_1 = require("../login");
const authService_1 = __importDefault(require("../../services/authService"));
// Mock AuthService methods
jest.mock("../../services/authService");
describe("LoginController", () => {
    let mockRequest;
    let mockResponse;
    beforeEach(() => {
        // Reset the mocks and create fresh request and response objects for each test
        jest.clearAllMocks();
        mockRequest = { body: {} };
        mockResponse = { render: jest.fn(), send: jest.fn(), status: jest.fn().mockReturnThis() };
    });
    describe("renderLoginPage", () => {
        it("should render the login page", () => {
            login_1.loginController.renderLoginPage(mockRequest, mockResponse);
            expect(mockResponse.render).toHaveBeenCalledWith("login");
        });
    });
    describe("handleLoginRequest", () => {
        it("should handle login request and send the result", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedHandleLoginRequest = (0, jest_mock_1.mocked)(authService_1.default.handleLoginRequest);
            mockedHandleLoginRequest.mockResolvedValue({
                code: 1,
                message: "Login Successfully",
                token: "sampleToken",
            });
            mockRequest.body = { username: "testUser", password: "testPassword" };
            yield login_1.loginController.handleLoginRequest(mockRequest, mockResponse);
            expect(mockResponse.send).toHaveBeenCalledWith({
                code: 1,
                message: "Login Successfully",
                token: "sampleToken",
            });
            expect(mockResponse.status).not.toHaveBeenCalled();
        }));
        it("should handle login request and send an error response on failure", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedHandleLoginRequest = jest.spyOn(authService_1.default, "handleLoginRequest");
            mockedHandleLoginRequest.mockRejectedValue(new Error("Authentication failed"));
            mockRequest.body = { username: "testUser", password: "testPassword" };
            yield login_1.loginController.handleLoginRequest(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalled();
        }));
    });
});
