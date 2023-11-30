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
const userRepository_1 = __importDefault(require("../userRepository"));
const user_1 = __importDefault(require("../../models/user"));
jest.mock("../../models/user", () => ({
    findOne: jest.fn(),
}));
const mockedFindOne = user_1.default.findOne;
describe("UserRepository", () => {
    describe("findUser", () => {
        it("should call findOne with the provided query", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const query = { username: "exampleUser", userpswd: "md5HashedPassword" };
            // Act
            yield userRepository_1.default.findUser(query);
            // Assert
            expect(user_1.default.findOne).toHaveBeenCalledWith(query);
        }));
        it("should return the result of findOne", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const query = { username: "exampleUser", userpswd: "md5HashedPassword" };
            const expectedResult = {
                username: "exampleUser",
                userpswd: "md5HashedPassword",
            };
            mockedFindOne.mockResolvedValueOnce(expectedResult);
            // Act
            const result = yield userRepository_1.default.findUser(query);
            // Assert
            expect(result).toEqual(expectedResult);
        }));
    });
});
