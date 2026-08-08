const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (uri) {
      try {
        console.log(`Connecting to MongoDB URI: ${uri}`);
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        console.log('MongoDB Connected via MONGODB_URI');
        return;
      } catch (err) {
        console.warn('Could not connect to specified MONGODB_URI. Falling back to MongoMemoryServer:', err.message);
      }
    }

    console.log('Starting MongoMemoryServer in-memory database...');
    mongoMemoryServer = await MongoMemoryServer.create();
    uri = mongoMemoryServer.getUri();
    await mongoose.connect(uri);
    console.log(`MongoDB Connected (In-Memory Server) at: ${uri}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
