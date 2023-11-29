/* eslint-disable */
import express from "express"
const router = express.Router()
import mongoose from "mongoose"
import { createHash } from "crypto"
import AuthService from "../services/authService"
import UserRepository from "../repositories/userRepository"
import LoginAttempt from "../models/loginAttempt"

// Connect to the MongoDB database
mongoose.connect(
  "mongodb+srv://Cluster65364:7AS99WtrYyq55skl@cluster65364.npvw6o7.mongodb.net/user_service",
  {},
)

// Render login views
router.get("/", function (req: any, res: any) {
  res.render("login")
})

router.post("/", async function (req: any, res: any) {
  try {
    console.log(req.body)
    const username = req.body.username
    const password = req.body.password

    // Check null value
    if (username == null || username.trim() == "" || password == null || password.trim() == null) {
      res.status(500).json({ error: "Username/Password cannot be empty" })
      return
    }

    // Check if the user is locked
    // if (loginAttempts[username] && loginAttempts[username].locked) {
    //   res.status(401).json({ error: "Account locked. Please contact support." })
    //   return
    // }
    const loginAttempt = await LoginAttempt.findOne({ username });

    if (loginAttempt && loginAttempt.locked) {
      res.status(401).json({ error: "Account locked. Please contact support." })
      return
    }

    // md5: hash password
    const md5String = createHash("md5").update(password).digest("hex")
    const queryString = { username: username, userpswd: md5String }
    res.set({ "Content-type": "application/json;charset=utf-8" })

    const user = await UserRepository.findUser(queryString)

    if (user) {
      const token = await AuthService.authenticateUser(username, password)
      res.send({ code: 1, message: "Login Successfully", token })
    } else {
      AuthService.trackFailedLogin(username)
      res.status(401).json({ error: "Incorrect Username and Password" })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
