import jwt from "jsonwebtoken"
import { createHash } from "crypto"
import UserInfo from "../models/user"

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
}

export default AuthService
