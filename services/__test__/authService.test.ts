import { mocked } from "jest-mock"
import AuthService from "../authService"
import UserInfo from "../../models/user"

// Mocking dependencies
jest.mock("../../models/user", () => ({
  findOne: jest.fn(),
}))

describe("AuthService", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("authenticateUser", () => {
    it("should authenticate user and generate a token", async () => {
      // Mock data
      const mockUser = {
        username: "testuser",
        userpswd: "md5hashofpassword",
      }

      // Mock methods
      mocked(UserInfo.findOne).mockResolvedValue(mockUser)
      const result = await AuthService.authenticateUser("testuser", "password")

      expect(result).toBeDefined()
      expect(typeof result).toBe("string")
    })

    it("should throw an error if username or password is missing", async () => {
      await expect(AuthService.authenticateUser("", "testPassword")).rejects.toThrow(
        "Username and password are required.",
      )

      await expect(AuthService.authenticateUser("testUser", "")).rejects.toThrow(
        "Username and password are required.",
      )

      await expect(AuthService.authenticateUser("", "")).rejects.toThrow(
        "Username and password are required.",
      )
    })

    it("should throw an error if user is not found", async () => {
      // Mock data
      const username = "testUser"
      const password = "testPassword"

      // Mock methods
      mocked(UserInfo.findOne).mockResolvedValue(null)

      // Call the method
      await expect(AuthService.authenticateUser(username, password)).rejects.toThrow(
        "Incorrect Username and Password",
      )

      // Assertions
      expect(UserInfo.findOne).toHaveBeenCalledWith({ username, userpswd: expect.any(String) })
    })
  })
})
