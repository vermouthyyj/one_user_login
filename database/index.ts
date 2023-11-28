import { MongoClient, type Db } from "mongodb"

let client: MongoClient
let _db: Db

const uri =
  "mongodb+srv://Cluster65364:7AS99WtrYyq55skl@cluster65364.npvw6o7.mongodb.net/?retryWrites=true&w=majority"
export const connect = async () => {
  try {
    client = new MongoClient(uri, {})
    await client.connect()
    console.log("Connected to MongoDB")
    _db = client.db("user_service")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
  }
}

export const getDb = () => {
  if (!_db) {
    console.error("MongoDB not connected")
  }
  return _db
}

export const close = async () => {
  try {
    await client.close()
    console.log("Connection closed")
  } catch (error) {
    console.error("Error closing connection:", error)
  }
}
