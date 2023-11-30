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
const crypto_1 = require("crypto");
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const database_1 = require("../database");
jest.setTimeout(30000);
describe("Login API", () => {
    let testUsername;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Specify the database and collection
        yield (0, database_1.connect)();
        const database = (0, database_1.getDb)();
        const collection = database.collection("user_info");
        // Data to be inserted
        const dataToInsert = {
            username: "test_user",
            userpswd: (0, crypto_1.createHash)("md5").update("test_password").digest("hex"),
            logindate: new Date(),
        };
        yield collection.insertOne(dataToInsert);
        testUsername = dataToInsert.username;
    }));
    it("should return a valid token on successful login", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(4);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/login")
            .send({ username: "test_user", password: "test_password" });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("code", 1);
        expect(res.body).toHaveProperty("message", "Login Successfully");
        expect(res.body).toHaveProperty("token");
    }));
    it("should return an error on incorrect login", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/login")
            .send({ username: "test_user", password: "wrong_password" });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Incorrect Username and Password");
    }));
    it("should return an error on incorrect login", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/login")
            .send({ username: "test_user", password: "wrong_password" });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Incorrect Username and Password");
    }));
    it("should return an error on incorrect login", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/login")
            .send({ username: "test_user", password: "wrong_password" });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Incorrect Username and Password");
    }));
    it("should return an error on incorrect login", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/login")
            .send({ username: "test_user", password: "wrong_password" });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Account locked. Please contact support.");
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Specify the database and collection
        const database = (0, database_1.getDb)();
        const collection = database.collection("user_info");
        const collection_attempt = database.collection("login_attempt");
        // Delete the user by username
        yield collection.deleteOne({ username: testUsername });
        yield collection_attempt.deleteOne({ username: testUsername });
        // Close the database connection
        yield mongoose_1.default.connection.close();
    }));
});
