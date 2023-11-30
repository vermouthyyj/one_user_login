import { Response } from "express"
import { userController } from "../index"

// Define a type for the session object
interface Session {
  user?: { username: string }
  error?: string
}

const mockRequest = (sessionData?: Session) => ({ session: sessionData || {} })
const mockResponse = () => {
  const res: Response = {} as Response
  res.redirect = jest.fn()
  res.render = jest.fn()
  return res
}

describe("UserController", () => {
  describe("login", () => {
    it('should render "index" if user is logged in', async () => {
      const req = mockRequest({ user: { username: "testUser" } })
      req.session.user = { username: "testUser" }
      const res = mockResponse()

      await userController.login(req, res)

      expect(res.render).toHaveBeenCalledWith("index", { title: "Express" })
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('should redirect to "/login" with an error message if user is not logged in', async () => {
      const req = mockRequest()
      const res = mockResponse()

      await userController.login(req, res)

      expect(res.redirect).toHaveBeenCalledWith("/login")
      expect(req.session.error).toBe("Please login")
      expect(res.render).not.toHaveBeenCalled()
    })
  })
})
