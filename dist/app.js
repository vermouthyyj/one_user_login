"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login_1 = __importDefault(require("./routes/login"));
// Import your custom routers
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const db_1 = require("./repositories/db");
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
}));
const allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "content-type,token,id");
    res.header("Access-Control-Request-Headers", "content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
};
app.use(allowCrossDomain);
// Connect to the database
(0, db_1.connectToDatabase)();
// Add interceptor
app.use(function (req, res, next) {
    // Get Header - Authorization
    const authorization = req.get("Authorization");
    // Skip login page
    if (req.path === "/login") {
        next();
    }
    else {
        const secretOrPrivateKey = "secretKey";
        if (authorization) {
            jsonwebtoken_1.default.verify(authorization, secretOrPrivateKey, function (err) {
                if (err) {
                    res.status(403).send("Cannot provide additional access O_O ");
                }
                else {
                    next();
                }
            });
        }
        else {
            // Handle case where authorization is undefined
            res.status(401).send("Authorization header is missing");
        }
    }
});
// view engine setup
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "jade");
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/", index_1.default);
app.use("/users", users_1.default);
app.use("/login", login_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
exports.default = app;
