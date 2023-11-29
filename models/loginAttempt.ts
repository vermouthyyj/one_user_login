import { Schema, Document, model } from "mongoose"

export interface LoginAttemptModel extends Document {
  username: string
  attempts: number
  timestamps: number[]
  locked?: boolean
}

const LoginAttemptSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  attempts: { type: Number, required: true },
  timestamps: { type: [Number], required: true },
  locked: { type: Boolean, default: false },
})

// const LoginAttempt = mongoose.model<LoginAttemptModel>("LoginAttempt", LoginAttemptSchema, "login_attempt")
const LoginAttempt = model<LoginAttemptModel>("LoginAttempt", LoginAttemptSchema, "login_attempt")
export default LoginAttempt
