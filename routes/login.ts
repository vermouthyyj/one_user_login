import express from "express"
import { loginController } from "../controller/login"
import mongoose from "mongoose"

// Connect to the MongoDB database
mongoose.connect(
  "mongodb+srv://Cluster65364:7AS99WtrYyq55skl@cluster65364.npvw6o7.mongodb.net/user_service",
  {},
)

const router = express.Router()

// Render login views
router.get("/", loginController.renderLoginPage)

router.post("/", loginController.handleLoginRequest)

export default router
