import { Router } from "express"
import { userController } from "../controller/index"

const router: Router = Router()

router.get("/login", userController.login)

export default router
