/* eslint-disable */
import express from "express"
const router = express.Router()
import mongoose from "mongoose"
import { createHash } from "crypto"
import AuthService from "../services/authService"
import UserRepository from "../repositories/userRepository"

// Connect to the MongoDB database
mongoose.connect(
  "mongodb+srv://Cluster65364:7AS99WtrYyq55skl@cluster65364.npvw6o7.mongodb.net/user_service",
  {},
)

// Dictionary to store user login attempts
interface LoginAttempt {
  attempts: number
  timestamps: number[]
  locked?: boolean
}

interface LoginAttemptsDictionary {
  [username: string]: LoginAttempt
}

const loginAttempts: LoginAttemptsDictionary = {}

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
    if (loginAttempts[username] && loginAttempts[username].locked) {
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
      trackFailedLogin(username)
      res.status(401).json({ error: "Incorrect Username and Password" })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

function trackFailedLogin(username: string) {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  if (!loginAttempts[username]) {
    loginAttempts[username] = { attempts: 1, timestamps: [currentTimestamp] }
  } else {
    loginAttempts[username].attempts++
    loginAttempts[username].timestamps.push(currentTimestamp)

    // Check if there are 3 or more failed attempts in the last 5 minutes
    const recentAttempts = loginAttempts[username].timestamps.filter(
      (timestamp) => currentTimestamp - timestamp <= 300,
    )

    console.log("loginAttempts: ", loginAttempts)
    if (recentAttempts.length >= 2) {
      // Lock the user
      loginAttempts[username].locked = true
    }
  }
}

export default router
