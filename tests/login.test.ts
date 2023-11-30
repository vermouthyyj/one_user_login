import { createHash } from "crypto"
import mongoose from "mongoose"
import request from "supertest"
import app from "../app"
import { connect, getDb } from "../database"
jest.setTimeout(30000)
describe("Login API", () => {
  let testUsername: string

  beforeAll(async () => {
    // Specify the database and collection
    await connect()
    const database = getDb()
    const collection = database.collection("user_info")

    // Data to be inserted
    const dataToInsert = {
      username: "test_user",
      userpswd: createHash("md5").update("test_password").digest("hex"),
      logindate: new Date(),
    }
    await collection.insertOne(dataToInsert)
    testUsername = dataToInsert.username
  })

  it("should return a valid token on successful login", async () => {
    expect.assertions(4)
    const res = await request(app)
      .post("/login")
      .send({ username: "test_user", password: "test_password" })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("code", 1)
    expect(res.body).toHaveProperty("message", "Login Successfully")
    expect(res.body).toHaveProperty("token")
  })

  it("should return an error on incorrect login", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "test_user", password: "wrong_password" })

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty("error", "Incorrect Username and Password")
  })

  it("should return an error on incorrect login", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "test_user", password: "wrong_password" })

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty("error", "Incorrect Username and Password")
  })

  it("should return an error on incorrect login", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "test_user", password: "wrong_password" })

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty("error", "Incorrect Username and Password")
  })

  it("should return an error on incorrect login", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "test_user", password: "wrong_password" })

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty("error", "Account locked. Please contact support.")
  })

  afterAll(async () => {
    // Specify the database and collection
    const database = getDb()
    const collection = database.collection("user_info")
    const collection_attempt = database.collection("login_attempt")

    // Delete the user by username
    await collection.deleteOne({ username: testUsername })
    await collection_attempt.deleteOne({ username: testUsername })

    // Close the database connection
    await mongoose.connection.close()
  })
})
