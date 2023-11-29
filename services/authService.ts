import jwt from "jsonwebtoken"
import { createHash } from "crypto"
import UserInfo from "../models/user"
import { error } from "shelljs"
import LoginAttempt from "../models/loginAttempt"

class AuthService {
  static async authenticateUser(username: string, password: string): Promise<string> {
    // Validate input
    if (!username || !password) {
      throw new Error("Username and password are required.")
    }

    // Authenticate user
    const md5String = createHash("md5").update(password).digest("hex")
    const user = await UserInfo.findOne({ username, userpswd: md5String })

    if (user) {
      // Generate JWT token
      const content = { username }
      const secretOrPrivateKey = "secretKey"
      const token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: 60 * 60 * 24 * 7, // token expires in 1 week
      })

      return token
    } else {
      throw new Error("Incorrect Username and Password")
    }
  }

  static async trackFailedLogin(username: string) {
    const currentTimestamp = Math.floor(Date.now() / 1000)
    try {
      let loginAttempt = await LoginAttempt.findOne({ username })
      if (!loginAttempt) {
        loginAttempt = new LoginAttempt({
          username,
          attempts: 1,
          timestamps: [currentTimestamp],
        })
      } else {
        loginAttempt.attempts++
        loginAttempt.timestamps.push(currentTimestamp)

        // Check if there are 3 or more failed attempts in the last 5 minutes
        const recentAttempts = loginAttempt.timestamps.filter(
          (timestamp: number) => currentTimestamp - timestamp <= 300,
        )

        if (recentAttempts.length >= 3) {
          // Lock the user
          loginAttempt.locked = true
        }
      }

      await loginAttempt.save()
    } catch {
      console.error("Error tracking failed login:", error)
    }
  }
}

export default AuthService
