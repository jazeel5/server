const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  password: { type: String },
  otp: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("customer", customerSchema);
