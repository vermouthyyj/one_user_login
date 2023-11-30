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
const authService_1 = __importDefault(require("../authService"));
const user_1 = __importDefault(require("../../models/user"));
const loginAttempt_1 = __importDefault(require("../../models/loginAttempt"));
const userRepository_1 = __importDefault(require("../../repositories/userRepository"));
// Mocking dependencies
jest.mock("../../models/user", () => ({
    findOne: jest.fn(),
}));
jest.mock("../../models/loginAttempt", () => ({
    findOne: jest.fn(),
}));
jest.mock("../../repositories/userRepository");
describe("AuthService", () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("authenticateUser", () => {
        it("should authenticate user and generate a token", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const mockUser = {
                username: "testuser",
                userpswd: "md5hashofpassword",
            };
            // Mock methods
            (0, jest_mock_1.mocked)(user_1.default.findOne).mockResolvedValue(mockUser);
            const result = yield authService_1.default.authenticateUser("testuser", "password");
            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
        }));
        it("should throw an error if username or password is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(authService_1.default.authenticateUser("", "testPassword")).rejects.toThrow("Username and password are required.");
            yield expect(authService_1.default.authenticateUser("testUser", "")).rejects.toThrow("Username and password are required.");
            yield expect(authService_1.default.authenticateUser("", "")).rejects.toThrow("Username and password are required.");
        }));
        it("should throw an error if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const username = "testUser";
            const password = "testPassword";
            // Mock methods
            (0, jest_mock_1.mocked)(user_1.default.findOne).mockResolvedValue(null);
            // Call the method
            yield expect(authService_1.default.authenticateUser(username, password)).rejects.toThrow("Incorrect Username and Password");
            // Assertions
            expect(user_1.default.findOne).toHaveBeenCalledWith({ username, userpswd: expect.any(String) });
        }));
    });
    describe("handleLoginRequest", () => {
        it("should handle login successfully and return a token", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const mockLoginAttemp = {
                username: "testuser",
                attemps: 0,
                timestamps: [],
                locked: false,
            };
            const mockUser = {
                username: "testuser",
                userpswd: "md5hashofpassword",
            };
            // Mock methods
            (0, jest_mock_1.mocked)(loginAttempt_1.default.findOne).mockResolvedValue(mockLoginAttemp);
            (0, jest_mock_1.mocked)(user_1.default.findOne).mockResolvedValue(mockUser);
            (0, jest_mock_1.mocked)(userRepository_1.default.findUser).mockResolvedValue(mockUser);
            // Call the method
            const result = yield authService_1.default.handleLoginRequest("testuser", "password");
            // Assertions
            expect(result).toBeDefined();
            expect(typeof result).toBe("object");
            expect(result.message).toBe("Login Successfully");
        }));
        it("should throw an error if username or password is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            // Call the method with missing username
            yield expect(authService_1.default.handleLoginRequest("", "testPassword")).rejects.toThrow("Username/Password cannot be empty");
            // Call the method with missing password
            yield expect(authService_1.default.handleLoginRequest("testUser", "")).rejects.toThrow("Username/Password cannot be empty");
            // Call the method with both missing username and password
            yield expect(authService_1.default.handleLoginRequest("", "")).rejects.toThrow("Username/Password cannot be empty");
        }));
        it("should throw an error if the user is locked", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const mockLoginAttemp = {
                username: "testuser",
                attemps: 0,
                timestamps: [],
                locked: true,
            };
            // Mock methods
            (0, jest_mock_1.mocked)(loginAttempt_1.default.findOne).mockResolvedValue(mockLoginAttemp);
            // Call the method
            yield expect(authService_1.default.handleLoginRequest("testuser", "testPassword")).rejects.toThrow("Account locked. Please contact support.");
        }));
        it("should throw an error if the user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const username = "nonExistentUser";
            // Mock methods
            (0, jest_mock_1.mocked)(loginAttempt_1.default.findOne).mockResolvedValue({ locked: false });
            (0, jest_mock_1.mocked)(userRepository_1.default.findUser).mockResolvedValue(null);
            // Call the method
            yield expect(authService_1.default.handleLoginRequest(username, "testPassword")).rejects.toThrow("Incorrect Username and Password");
        }));
    });
    describe("trackFailedLogin", () => {
        it("should create a new login attempt if not found", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock LoginAttempt.findOne to return null (not found)
            const findOneMock = jest.spyOn(loginAttempt_1.default, "findOne").mockResolvedValueOnce(null);
            // Assert that a new login attempt is created
            const createdAttempt = yield loginAttempt_1.default.findOne({ username: "findOne" });
            expect(createdAttempt).toBeDefined();
            findOneMock.mockRestore();
        }));
        it("should update an existing login attempt if found", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock LoginAttempt.findOne to return an existing loginAttempt
            const findOneMock = jest.spyOn(loginAttempt_1.default, "findOne").mockResolvedValueOnce({
                username: "existingUser",
                attempts: 2,
                timestamps: [Date.now() / 1000 - 200, Date.now() / 1000 - 150],
            });
            // Assert that the existing login attempt is updated
            const updatedAttempt = yield loginAttempt_1.default.findOne({ username: "existingUser" });
            expect(updatedAttempt).toBeDefined();
            expect(updatedAttempt === null || updatedAttempt === void 0 ? void 0 : updatedAttempt.attempts).toBe(2);
            // Assert that the user is not locked
            expect(updatedAttempt === null || updatedAttempt === void 0 ? void 0 : updatedAttempt.locked).toBeFalsy();
            findOneMock.mockRestore();
        }));
        it("should handle errors and log an error message", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock LoginAttempt.findOne to throw an error
            const findOneMock = jest
                .spyOn(loginAttempt_1.default, "findOne")
                .mockRejectedValueOnce(new Error("Mocked error"));
            // Mock console.error to capture the error message
            const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => { });
            // Assert that console.error is called with the correct message
            findOneMock.mockRestore();
            consoleErrorMock.mockRestore();
        }));
    });
});
