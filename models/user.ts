import { type Document, Schema, model } from "mongoose"

interface IUser extends Document {
  username: string
  userpswd: string
  logindate: Date
}

const UserSchema = new Schema<IUser>({
  username: String,
  userpswd: String,
  logindate: Date,
})

const UserInfo = model<IUser>("UserInfo", UserSchema, "user_info")

export default UserInfo
