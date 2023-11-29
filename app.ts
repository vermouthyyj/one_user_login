/* eslint-disable */
import createError from "http-errors"
import express from "express"
import path, { dirname } from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import jwt from "jsonwebtoken"
import loginRouter from "./routes/login"

// Import your custom routers
import indexRouter from "./routes/index"
import usersRouter from "./routes/users"
import { Request, Response, NextFunction } from "express"

const app = express()

const allowCrossDomain = function (req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
  res.header("Access-Control-Allow-Headers", "content-type,token,id")
  res.header("Access-Control-Request-Headers", "content-Type, Authorization")
  res.header("Access-Control-Allow-Credentials", "true")
  next()
}
app.use(allowCrossDomain)

// Add interceptor
app.use(function (req, res, next) {
  // Get Header - Authorization
  const authorization = req.get("Authorization")
  // Skip login page
  if (req.path === "/login") {
    next()
  } else {
    const secretOrPrivateKey = "secretKey"
    if (authorization) {
      jwt.verify(authorization, secretOrPrivateKey, function (err) {
        if (err) {
          res.status(403).send("Cannot provide additional access O_O ")
        } else {
          next()
        }
      })
    } else {
      // Handle case where authorization is undefined
      res.status(401).send("Authorization header is missing")
    }
  }
})

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/login", loginRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err: any, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

export default app
