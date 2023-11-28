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
const index_1 = require("./index");
const crypto_1 = require("crypto");
const insertData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield (0, index_1.connect)();
        // Specify the database and collection
        const database = (0, index_1.getDb)();
        const collection = database.collection("user_info");
        // Data to be inserted
        const dataToInsert = {
            username: "rachel_yan",
            userpswd: (0, crypto_1.createHash)("md5").update("secure_password").digest("hex"),
            logindate: new Date(),
        };
        // Insert a single document
        const result = yield collection.insertOne(dataToInsert);
        console.log("Successfully inserted:", result);
    }
    catch (error) {
        console.error("Error inserting data:", error);
    }
    finally {
        // Close the connection when done
        yield (0, index_1.close)();
    }
});
// Call the function to insert data
insertData();
