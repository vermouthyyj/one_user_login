import { getDb, close, connect } from "./index"
import { createHash } from "crypto"

const insertData = async () => {
  try {
    // Connect to MongoDB
    await connect()

    // Specify the database and collection
    const database = getDb()
    const collection = database.collection("user_info")

    // Process command-line arguments
    const username = process.argv[2] || "default_username"
    const password = process.argv[3] || "default_password"
    // Data to be inserted
    const dataToInsert = {
      username: username,
      userpswd: createHash("md5").update(password).digest("hex"),
      logindate: new Date(),
    }

    // Insert a single document
    const result = await collection.insertOne(dataToInsert)
    console.log("Successfully inserted:", result)
  } catch (error) {
    console.error("Error inserting data:", error)
  } finally {
    // Close the connection when done
    await close()
  }
}

// Call the function to insert data
insertData()
