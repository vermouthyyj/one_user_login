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
// Mocking dependencies
jest.mock("../../models/user", () => ({
    findOne: jest.fn(),
}));
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
});
