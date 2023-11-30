import UserRepository from "../userRepository"
import UserInfo from "../../models/user"
jest.mock("../../models/user", () => ({
  findOne: jest.fn(),
}))

interface IUser {
  username: string
  userpswd: string
}

const mockedFindOne = UserInfo.findOne as jest.MockedFunction<typeof UserInfo.findOne>

describe("UserRepository", () => {
  describe("findUser", () => {
    it("should call findOne with the provided query", async () => {
      // Arrange
      const query = { username: "exampleUser", userpswd: "md5HashedPassword" }

      // Act
      await UserRepository.findUser(query)

      // Assert
      expect(UserInfo.findOne).toHaveBeenCalledWith(query)
    })

    it("should return the result of findOne", async () => {
      // Arrange
      const query = { username: "exampleUser", userpswd: "md5HashedPassword" }
      const expectedResult: IUser | null = {
        username: "exampleUser",
        userpswd: "md5HashedPassword",
      }
      mockedFindOne.mockResolvedValueOnce(expectedResult)

      // Act
      const result = await UserRepository.findUser(query)

      // Assert
      expect(result).toEqual(expectedResult)
    })
  })
})
