"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
// Connect to the MongoDB database
mongoose_1.default.connect('mongodb+srv://Cluster65364:7AS99WtrYyq55skl@cluster65364.npvw6o7.mongodb.net/user_service', {});
// Render login views
router.get('/', function (req, res) {
    res.render('login');
});
router.post('/', function (req, res) {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    // Check null value
    if (username == null ||
        username.trim() == '' ||
        password == null ||
        password.trim() == null) {
        res.send({ code: 500, message: 'Username/Password cannot be empty' });
        return;
    }
    // md5: hash password
    const md5String = (0, crypto_1.createHash)('md5').update(password).digest('hex');
    const queryString = { username: username, userpswd: md5String };
    res.set({ 'Content-type': 'application/json;charset=utf-8' });
    user_1.default.findOne(queryString)
        .then((data) => {
        return new Promise((resolve, reject) => {
            if (data) {
                resolve(data);
            }
            else {
                reject('Incorrect Username and Password');
            }
        }).then((data) => {
            // Generate jwt
            const content = { username: username };
            // Secret
            const secretOrPrivateKey = 'secretKey';
            const token = jsonwebtoken_1.default.sign(content, secretOrPrivateKey, {
                expiresIn: 60 * 60 * 24 * 7, // token expires in 1 week
            });
            res.send({ code: 1, message: 'Login Successfully', token: token });
        }).catch((msg) => {
            res.status(401).json({ error: msg });
        });
    })
        .catch((err) => {
        if (err) {
            res.status(500).send(err);
            console.log(err);
        }
    });
});
exports.default = router;
