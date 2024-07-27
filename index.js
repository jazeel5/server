const express = require("express");
const ConnectToMongo = require("./db");
ConnectToMongo();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(
  cors()
);
const PORT = process.env.PORT || 4000;
app.get("/", (req, res) => {
  res.json({ message: "server file" })
})

app.use("/customer", require("./Routes/customer_Routes"));


//uploads
// app.use("/uploads/customer", express.static("./Uploads/customer"));

app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});