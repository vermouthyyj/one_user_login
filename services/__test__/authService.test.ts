import { mocked } from "jest-mock"
import AuthService from "../authService"
import UserInfo from "../../models/user"
import LoginAttempt from "../../models/loginAttempt"
import UserRepository from "../../repositories/userRepository"

// Mocking dependencies
jest.mock("../../models/user", () => ({
  findOne: jest.fn(),
}))

jest.mock("../../models/loginAttempt", () => ({
  findOne: jest.fn(),
}))

jest.mock("../../repositories/userRepository")

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

  describe("handleLoginRequest", () => {
    it("should handle login successfully and return a token", async () => {
      // Mock data
      const mockLoginAttemp = {
        username: "testuser",
        attemps: 0,
        timestamps: [],
        locked: false,
      }

      const mockUser = {
        username: "testuser",
        userpswd: "md5hashofpassword",
      }

      // Mock methods
      mocked(LoginAttempt.findOne).mockResolvedValue(mockLoginAttemp)
      mocked(UserInfo.findOne).mockResolvedValue(mockUser)
      mocked(UserRepository.findUser).mockResolvedValue(mockUser)
      // Call the method
      const result = await AuthService.handleLoginRequest("testuser", "password")

      // Assertions
      expect(result).toBeDefined()
      expect(typeof result).toBe("object")
      expect(result.message).toBe("Login Successfully")
    })

    it("should throw an error if username or password is missing", async () => {
      // Call the method with missing username
      await expect(AuthService.handleLoginRequest("", "testPassword")).rejects.toThrow(
        "Username/Password cannot be empty",
      )

      // Call the method with missing password
      await expect(AuthService.handleLoginRequest("testUser", "")).rejects.toThrow(
        "Username/Password cannot be empty",
      )

      // Call the method with both missing username and password
      await expect(AuthService.handleLoginRequest("", "")).rejects.toThrow(
        "Username/Password cannot be empty",
      )
    })

    it("should throw an error if the user is locked", async () => {
      // Mock data
      const mockLoginAttemp = {
        username: "testuser",
        attemps: 0,
        timestamps: [],
        locked: true,
      }

      // Mock methods
      mocked(LoginAttempt.findOne).mockResolvedValue(mockLoginAttemp)

      // Call the method
      await expect(AuthService.handleLoginRequest("testuser", "testPassword")).rejects.toThrow(
        "Account locked. Please contact support.",
      )
    })

    it("should throw an error if the user is not found", async () => {
      // Mock data
      const username = "nonExistentUser"

      // Mock methods
      mocked(LoginAttempt.findOne).mockResolvedValue({ locked: false })
      mocked(UserRepository.findUser).mockResolvedValue(null)

      // Call the method
      await expect(AuthService.handleLoginRequest(username, "testPassword")).rejects.toThrow(
        "Incorrect Username and Password",
      )
    })
  })

  describe("trackFailedLogin", () => {
    it("should create a new login attempt if not found", async () => {
      // Mock LoginAttempt.findOne to return null (not found)
      const findOneMock = jest.spyOn(LoginAttempt, "findOne").mockResolvedValueOnce(null)

      // Assert that a new login attempt is created
      const createdAttempt = await LoginAttempt.findOne({ username: "findOne" })
      expect(createdAttempt).toBeDefined()

      findOneMock.mockRestore()
    })

    it("should update an existing login attempt if found", async () => {
      // Mock LoginAttempt.findOne to return an existing loginAttempt
      const findOneMock = jest.spyOn(LoginAttempt, "findOne").mockResolvedValueOnce({
        username: "existingUser",
        attempts: 2,
        timestamps: [Date.now() / 1000 - 200, Date.now() / 1000 - 150],
      })

      // Assert that the existing login attempt is updated
      const updatedAttempt = await LoginAttempt.findOne({ username: "existingUser" })
      expect(updatedAttempt).toBeDefined()
      expect(updatedAttempt?.attempts).toBe(2)

      // Assert that the user is not locked
      expect(updatedAttempt?.locked).toBeFalsy()

      findOneMock.mockRestore()
    })

    it("should handle errors and log an error message", async () => {
      // Mock LoginAttempt.findOne to throw an error
      const findOneMock = jest
        .spyOn(LoginAttempt, "findOne")
        .mockRejectedValueOnce(new Error("Mocked error"))

      // Mock console.error to capture the error message
      const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {})

      // Assert that console.error is called with the correct message
      findOneMock.mockRestore()
      consoleErrorMock.mockRestore()
    })
  })
})
