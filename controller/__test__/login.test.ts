import { Request, Response } from "express"
import { mocked } from "jest-mock"
import { loginController } from "../login"
import AuthService from "../../services/authService"

// Mock AuthService methods
jest.mock("../../services/authService")

describe("LoginController", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    // Reset the mocks and create fresh request and response objects for each test
    jest.clearAllMocks()
    mockRequest = { body: {} }
    mockResponse = { render: jest.fn(), send: jest.fn(), status: jest.fn().mockReturnThis() }
  })

  describe("renderLoginPage", () => {
    it("should render the login page", () => {
      loginController.renderLoginPage(mockRequest as Request, mockResponse as Response)
      expect(mockResponse.render).toHaveBeenCalledWith("login")
    })
  })

  describe("handleLoginRequest", () => {
    it("should handle login request and send the result", async () => {
      const mockedHandleLoginRequest = mocked(AuthService.handleLoginRequest)
      mockedHandleLoginRequest.mockResolvedValue({
        code: 1,
        message: "Login Successfully",
        token: "sampleToken",
      })

      mockRequest.body = { username: "testUser", password: "testPassword" }
      await loginController.handleLoginRequest(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.send).toHaveBeenCalledWith({
        code: 1,
        message: "Login Successfully",
        token: "sampleToken",
      })
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it("should handle login request and send an error response on failure", async () => {
      const mockedHandleLoginRequest = jest.spyOn(AuthService, "handleLoginRequest")
      mockedHandleLoginRequest.mockRejectedValue(new Error("Authentication failed"))

      mockRequest.body = { username: "testUser", password: "testPassword" }
      await loginController.handleLoginRequest(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.send).toHaveBeenCalled()
    })
  })
})
