const { MongoClient, ServerApiVersion } = require("mongodb");
const env = require("dotenv");
env.config();

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
