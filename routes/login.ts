/* eslint-disable */
import express from "express"
const router = express.Router()
import mongoose from "mongoose"
import UserInfo from "../models/user"
import jwt from "jsonwebtoken"
import { createHash } from "crypto"

// Connect to the MongoDB database
mongoose.connect(
  "mongodb+srv://Cluster65364:7AS99WtrYyq55skl@cluster65364.npvw6o7.mongodb.net/user_service",
  {},
)

// Dictionary to store user login attempts
interface LoginAttempt {
  attempts: number;
  timestamps: number[];
  locked?: boolean;
}

interface LoginAttemptsDictionary {
  [username: string]: LoginAttempt;
}

const loginAttempts: LoginAttemptsDictionary = {};

// Render login views
router.get("/", function (req: any, res: any) {
  res.render("login")
})

router.post("/", function (req: any, res: any) {
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
    res.status(401).json({ error: "Account locked. Please contact support." });
    return;
  }

  // md5: hash password
  const md5String = createHash("md5").update(password).digest("hex")
  const queryString = { username: username, userpswd: md5String }
  res.set({ "Content-type": "application/json;charset=utf-8" })

  UserInfo.findOne(queryString)
    .then((data: any) => {
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject("Incorrect Username and Password")
        }
      })
        .then((data) => {
          // Generate jwt
          const content = { username: username }

          // Secret
          const secretOrPrivateKey = "secretKey"
          const token = jwt.sign(content, secretOrPrivateKey, {
            expiresIn: 60 * 60 * 24 * 7, // token expires in 1 week
          })

          res.send({ code: 1, message: "Login Successfully", token: token })
        })
        .catch((msg: any) => {
          trackFailedLogin(username);
          res.status(401).json({ error: msg })
        })
    })
    .catch((err: any) => {
      if (err) {
        res.status(500).send(err)
        console.log(err)
      }
    })
})

function trackFailedLogin(username: string) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (!loginAttempts[username]) {
    loginAttempts[username] = { attempts: 1, timestamps: [currentTimestamp] };
  } else {
    loginAttempts[username].attempts++;
    loginAttempts[username].timestamps.push(currentTimestamp);

    // Check if there are 3 or more failed attempts in the last 5 minutes
    const recentAttempts = loginAttempts[username].timestamps.filter(
      (timestamp) => currentTimestamp - timestamp <= 300
    );

    console.log("loginAttempts: ", loginAttempts);
    if (recentAttempts.length >= 2) {
      // Lock the user
      loginAttempts[username].locked = true;
    }
  }
}

export default router
