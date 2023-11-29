import mongoose from "mongoose"

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Cluster65364:7AS99WtrYyq55skl@cluster65364.npvw6o7.mongodb.net/user_service",
      {},
    )
    console.log("Connected to the database")
  } catch (error) {
    console.error("Error connecting to the database:", error)
  }
}

export { connectToDatabase }
