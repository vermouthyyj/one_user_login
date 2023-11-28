import { connect, getDb, close } from './index'
import { createHash } from 'crypto'

const insertData = async () => {
  try {
    // Connect to MongoDB
    await connect()

    // Specify the database and collection
    const database = getDb()
    const collection = database.collection('user_info')

    // Data to be inserted
    const dataToInsert = {
      username: 'rachel_yan',
      userpswd: createHash('md5').update('secure_password').digest('hex'),
      logindate: new Date(),
    }

    // Insert a single document
    const result = await collection.insertOne(dataToInsert)
    console.log('Successfully inserted:', result)
  } catch (error) {
    console.error('Error inserting data:', error)
  } finally {
    // Close the connection when done
    await close()
  }
}

// Call the function to insert data
insertData()
