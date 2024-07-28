const express = require("express");
const cors = require("cors");
const ConnectToMongo = require("./db");
const customerRoutes = require("./Routes/customer_Routes");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "working server file" });
});

app.use("/customer", customerRoutes);

// Start server only if MongoDB connection is successful
const startServer = async () => {
  try {
    await ConnectToMongo();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB, server not started", err);
    process.exit(1); // Exit process with failure
  }
};

startServer();

// Handle uncaught exceptions and unhandled promise rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
