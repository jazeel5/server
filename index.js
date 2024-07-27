const express = require("express");
const ConnectToMongo = require("./db");
ConnectToMongo();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://login-app-api.vercel.app"],
    method: ["POST", "GET"],
    credentials: true,
  })
);
const PORT = process.env.PORT || 4000;
app.use("/customer", require("./Routes/customer_Routes"));

//uploads
// app.use("/uploads/customer", express.static("./Uploads/customer"));

app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});