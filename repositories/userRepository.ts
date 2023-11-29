import UserInfo from "../models/user"

class UserRepository {
  static async findUser(query: any): Promise<any> {
    return UserInfo.findOne(query)
  }
}

export default UserRepository
