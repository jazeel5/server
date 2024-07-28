const mongoose = require("mongoose");
const env = require('dotenv')
env.config()

const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectMongoDb;