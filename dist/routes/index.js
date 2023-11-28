"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../controller/index");
const router = (0, express_1.Router)();
router.get("/login", index_1.userController.login);
exports.default = router;
