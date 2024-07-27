const { MongoClient, ServerApiVersion } = require("mongodb");
const env = require("dotenv");
env.config();

// MONGO_URI="mongodb+srv://gauthamkotian020:RbsFEavCpsZ3H3KP@login-app.5m8yqde.mongodb.net/?retryWrites=true&w=majority&appName=login-app"

const uri = process.env.MONGO_URI;

let client;
let clientPromise;

if (!client) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  clientPromise = client.connect();
}

const connectToMongo = async () => {
  try {
    await clientPromise;
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

module.exports = connectToMongo;
