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
exports.close = exports.getDb = exports.connect = void 0;
const mongodb_1 = require("mongodb");
let client;
let _db;
const uri = 'mongodb+srv://Cluster65364:7AS99WtrYyq55skl@cluster65364.npvw6o7.mongodb.net/?retryWrites=true&w=majority';
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        client = new mongodb_1.MongoClient(uri, {});
        yield client.connect();
        console.log('Connected to MongoDB');
        _db = client.db('user_service');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
});
exports.connect = connect;
const getDb = () => {
    if (!_db) {
        console.error('MongoDB not connected');
    }
    return _db;
};
exports.getDb = getDb;
const close = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.close();
        console.log('Connection closed');
    }
    catch (error) {
        console.error('Error closing connection:', error);
    }
});
exports.close = close;
